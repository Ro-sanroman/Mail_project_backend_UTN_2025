// Backend

// Estructura del proyecto:

src/
  config/           MongoDB, nodemailer y variables de entorno
  controllers/      HTTP (Auth, Workspace, Channel, Message, Member)
  middlewares/      Autenticación JWT, validaciones de workspace/channel, Joi
  models/           Esquemas Mongoose (User, Workspace, Channel, Member, Message)
  repositories/     Acceso a datos y funciones
  sevices/          Casos de uso (auth, workspace, channel, messages, member)
  routes/           Endpoints /api/auth, /api/workspace, /api/member
  main.js           Bootstrap Express, CORS, logs, rutas y handlers globales
vercel.json         Deploy serverless 


-----

//  Requisitos previos:

Node.js 22.x
MongoDB Atla
Cuenta de Gmail

-----

// Instalación y ejecución local:

bash:
npm install
npm run dev


El servidor lee PORT (8080) e inicia src/main.js, conectándose a MongoDB

-----

// Variables de entorno:

Variable - Descripción 
PORT - Puerto local
MONGO_DB_CONNECTION_STRING - Cadena de conexión completa de MongoDB
JWT_SECRET - Clave para firmar tokens de login, invitaciones y verificación
GMAIL_USER / GMAIL_PASSWORD - Credenciales para Gmail usado por Nodemailer
URL_FRONTEND - URL del cliente
URL_BACKEND - URL pública del backend


// Ejemplo de variables:

PORT=8080
MONGO_DB_CONNECTION_STRING=mongodb+srv://<user>:<pass>@cluster/db
JWT_SECRET=secret-key
GMAIL_USER=name.123@gmail.com
GMAIL_PASSWORD=password-123
URL_FRONTEND=https://frontend.vercel.app
URL_BACKEND=https://backend.vercel.app


-----

// Modelado de datos:

User: nombre, email único, password hasheado, boolean active y verified_email.
Workspace: nombre, imagen opcional, timestamps y boolean active.
MemberWorkspace: relación usuario << >> workspace con rol (admin o user).
Channel: pertenece a un workspace.
ChannelMessages: guarda channel_id, sender_member_id y content.

-----

// Proceso de autentificación:

1- Registro (POST /api/auth/register): valida campos con Joi, hashea password, guarda usuario y envía mail de verificación con link
2- Verificación de email (GET /api/auth/verify-email/:token): marca verified_email=true y redirige al frontend
3- Login (POST /api/auth/login): exige mail verificado, genera JWT (24h) con name, email, id
4- Rutas protegidas: requieren headerAuthorization: Bearer <token> y pasan por auth.middleware.js, que valida el token y adjunta request.user

-----

// Endpoints principales:

Auth
POST /api/auth/register – body { name, email, password }
POST /api/auth/login – body { email, password } >> responde { auth_token }
GET /api/auth/verify-email/:verification_token – usado al clickear el mail

Workspaces
GET /api/workspace/ – devuelve todos los workspaces asociados al usuario verificado
POST /api/workspace/ – crea workspace y agrega al autor como admin
GET /api/workspace/:workspace_id – detalle + canales del workspace
POST /api/workspace/:workspace_id/invite – solo para admins. Envía correo con token

Canales
POST /api/workspace/:workspace_id/channels – crea canal (solo admins)
GET /api/workspace/:workspace_id/channels – retorna listado de canales

Mensajes
GET /api/workspace/:workspace_id/channels/:channel_id/messages – listado formateado con autor
POST /api/workspace/:workspace_id/channels/:channel_id/messages – guarda y devuelve colección actualizada

Invitaciones
GET /api/member/confirm/:invitation_token – decodifica el token, crea el MemberWorkspace y redirige al login del frontend

-----

// Despliegue en Vercel:

Configurado con vercel.json para usar @vercel/node apuntando a src/main.js