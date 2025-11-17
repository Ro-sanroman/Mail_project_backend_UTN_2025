import ENVIRONMENT from "../config/environment.config.js"
import { ServerError } from "../error.js"
import jwt from 'jsonwebtoken'

function authMiddleware(request, response, next) {
    console.log('\n[authMiddleware] ========== INICIANDO ==========')
    try {
        const auth_header = request.headers.authorization
        console.log('[authMiddleware] auth_header recibido:', auth_header ? 'YES' : 'NO')
        
        if (!auth_header) {
            console.log('[authMiddleware] NO HAY HEADER')
            throw new ServerError(401, 'No hay header de autorizacion')
        }

        // Logs de debugging (solo en desarrollo) - no mostrar en producción
        if (process.env.NODE_ENV !== 'production') {
            try {
                const masked = auth_header && typeof auth_header === 'string'
                    ? (auth_header.length > 30 ? `${auth_header.slice(0,20)}...${auth_header.slice(-10)}` : auth_header)
                    : String(auth_header)
                console.log('[authMiddleware] Authorization header:', masked)
            }
            catch (e) {
                // ignore logging errors
            }
        }

        const auth_token = auth_header.split(' ')[1]
        console.log('[authMiddleware] auth_token extraido:', auth_token ? 'YES' : 'NO')
        
        if (!auth_token) {
            console.log('[authMiddleware] NO HAY TOKEN')
            throw new ServerError(401, 'No hay token de autorizacion')
        }

        // Asegurarnos de que la secret esté configurada en el entorno
        if (!ENVIRONMENT.JWT_SECRET) {
            console.error('JWT_SECRET no configurado en el servidor')
            throw new ServerError(500, 'JWT_SECRET no configurado en el servidor')
        }

        // Log temporal: decodificar el token sin verificar para ver iat/exp y estructura
        try {
            const decoded = jwt.decode(auth_token, { complete: true });
            console.log('[authMiddleware] Token decodificado (sin verificar):', JSON.stringify(decoded, null, 2));
        } catch (e) {
            console.error('[authMiddleware] Error al decodificar token:', e);
        }

        console.log('[authMiddleware] Verificando token...')
        const user_session_data = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET)
        console.log('[authMiddleware] Token verificado exitosamente')

        // Guardamos los datos del token dentro de la request
        request.user = user_session_data
        console.log('[authMiddleware] Usuario asignado:', user_session_data.id)
        next()
    }
    catch (error) {
        console.log('[authMiddleware] ERROR CAPTURADO')
        // Loguear stack para debug en desarrollo
        if (process.env.NODE_ENV !== 'production') {
            console.error('[authMiddleware] error stack:', error && error.stack ? error.stack : error)
        }
        // Token expirado es una subclase de JsonWebTokenError, chequeamos primero
        if (error instanceof jwt.TokenExpiredError) {
            console.log('[authMiddleware] Token expirado')
            return response.status(401).json({ ok: false, message: 'Token expirado', status: 401 })
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            console.log('[authMiddleware] Token inválido')
            return response.status(400).json({ ok: false, message: 'Token invalido', status: 400 })
        }
        else if (error.status) {
            console.log('[authMiddleware] ServerError con status:', error.status)
            return response.status(error.status).json({
                ok: false,
                message: error.message,
                status: error.status
            })
        }
        else {
            console.error('[authMiddleware] Error genérico:', error)
            return response.status(500).json({ ok: false, message: 'Error interno del servidor', status: 500 })
        }
    }
}

export default authMiddleware