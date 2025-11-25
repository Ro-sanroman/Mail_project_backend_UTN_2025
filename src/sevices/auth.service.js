import { env } from "node:process";
import ENVIRONMENT from "../config/environment.config.js";
import mailTransporter from "../config/mailTransporter.config.js";
import { ServerError } from "../error.js";
import UserRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
    static async register({ name, email, password }) {
    console.log('AuthService.register payload:', { name, email, password });

    if (!email || !password) {
      throw new ServerError(400, 'Email y password son obligatorios');
    }

   
    const userExisting = await UserRepository.getByEmail(email);
    if (userExisting) {
      throw new ServerError(400, 'Email ya en uso');
    }

    const password_hashed = await bcrypt.hash(password, 12);

   
    const userData = {
      name: name || email.split('@')[0],
      email,
      password: password_hashed
    };
    console.log('[AUTH SERVICE] userData before create:', userData);


    const user_created = await UserRepository.create(userData.name, userData.email, userData.password);


    console.log('[AUTH SERVICE] user_created:', user_created);

    const user_id_created = user_created._id;

  
    const verification_token = jwt.sign({ user_id: user_id_created }, ENVIRONMENT.JWT_SECRET);

    const verificationLink = `${ENVIRONMENT.URL_BACKEND}/api/auth/verify-email/${verification_token}`;
    const mailOptions = {
      from: ENVIRONMENT.GMAIL_USER,
      to: email,
      subject: 'Verifica tu cuenta de mail',
      html: `<h1>Verifica tu cuenta</h1><a href="${verificationLink}">Verificar</a>`
    };

   
    try {
      const info = await mailTransporter.sendMail(mailOptions);
      console.log('[SENDMAIL] info:', {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response
      });
    } catch (mailError) {
      console.error('[SENDMAIL] ERROR:', mailError && (mailError.stack || mailError));
    
    }

    return {
      ok: true,
      message: 'Usuario registrado con exito',
      status: 201,
      userId: user_id_created
    };
  }

  static async verifyEmail(verification_token) {
    try {
      
      const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET);
      const { user_id } = payload;
      if (!user_id) {
        throw new ServerError(
          400,
          "Accion denegada, token con datos insuficientes"
        );
      }

      const user_found = await UserRepository.getById(user_id);
      if (!user_found) {
        throw new ServerError(404, "Usuario no encontrado");
      }

      if (user_found.verified_email) {
        throw new ServerError(400, "Usuario ya verificado");
      }

      await UserRepository.updateById(user_id, { verified_email: true });

      return;
    } catch (error) {
      
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ServerError(400, "Accion denegada, token invalido");
      }
      throw error;
    }
  }

static async login (email, password){


        const user_found = await UserRepository.getByEmail(email)
        
        if(!user_found) {
            throw new ServerError(404, 'Usuario con este mail no encontrado')
        }
        
        if(!user_found.verified_email){
            throw new ServerError(401, 'Usuario con mail no verificado')
        }

        const is_same_passoword = await bcrypt.compare( password, user_found.password )
        if(!is_same_passoword){
            throw new ServerError(401, 'Contraseña invalida')
        }

        const auth_token = jwt.sign(
            {
                name: user_found.name,
                email: user_found.email,
                id: user_found._id,
            },
            ENVIRONMENT.JWT_SECRET,
            {
                expiresIn: '24h'
            }
        )

        return {
            auth_token: auth_token
        }
    }
}
export default AuthService;

