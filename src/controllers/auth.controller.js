import ENVIRONMENT from "../config/environment.config.js";
import { ServerError } from "../error.js";
import AuthService from "../sevices/auth.service.js";

class AuthController {
  static async register(request, response) {
    try {
      console.log("Registro recibido:", request.body);

      const name =
        request.body.name ?? request.body.username ?? request.body.user ?? "";
      const email = request.body.email ?? request.body.mail ?? "";
      const password = request.body.password ?? request.body.pass ?? "";

      const result = await AuthService.register({ name, email, password });

      return response.status(result.status || 201).json(result);
    } catch (error) {
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          message: error.message,
          status: error.status,
        });
      } else {
        console.error("ERROR AL REGISTRAR", error);
        return response.status(500).json({
          ok: false,
          message: "Error interno del servidor",
          status: 500,
        });
      }
    }
  }

  static async verifyEmail(request, response) {
    try {
      const { verification_token } = request.params;

      await AuthService.verifyEmail(verification_token);
      response.redirect(
        ENVIRONMENT.URL_FRONTEND + "/login?from=verified_email"
      );
    } catch (error) {
      const accept = request.headers.accept || "";
      if (error.status) {
        if (accept.includes("application/json")) {
          return response
            .status(error.status)
            .json({ ok: false, message: error.message, status: error.status });
        }
        return response.status(error.status).send(`<h1>${error.message}</h1>`);
      }
      console.error("ERROR AL VERIFICAR", error);
      if (accept.includes("application/json")) {
        return response
          .status(500)
          .json({
            ok: false,
            message: "Error en el servidor, intentelo mas tarde",
            status: 500,
          });
      }
      return response
        .status(500)
        .send(`<h1>Error en el servidor, intentelo mas tarde</h1>`);
    }
  }

  static async login(request, response) {
    try {
      const { email, password } = request.body;

      const { auth_token } = await AuthService.login(email, password);

      return response.json({
        ok: true,
        message: "Usuario logueado con exito",
        status: 200,
        body: { auth_token },
      });
    } catch (error) {
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          message: error.message,
          status: error.status,
        });
      } else {
        console.error("ERROR AL LOGUEAR", error);
        return response.status(500).json({
          ok: false,
          message: "Error interno del servidor",
          status: 500,
        });
      }
    }
  }
}

export default AuthController;
