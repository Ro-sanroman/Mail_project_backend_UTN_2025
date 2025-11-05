import express from 'express'
import connectToMongoDB from './config/configMongoDB.config.js'
import mailTransporter from './config/mailTransporter.config.js'
import ENVIRONMENT from './config/environment.config.js'
import cors from 'cors'
import authRouter from './routes/auth.router.js'
import workspaceRouter from './routes/workspace.router.js'

const app = express()

connectToMongoDB()

//Configuro a mi API como API publica, cualquier dominio puede hacer peticiones
app.use( cors() )


app.use(express.json())

//Todas las consultas que empiezen con /api/auth va a ser gestionadas por el authRouter
app.use('/api/auth', authRouter)
app.use('/api/workspace', workspaceRouter)

/*
mailTransporter.sendMail(
    {
        from: ENVIRONMENT.GMAIL_USER, //Desde quien
        to:  'rosario.sanroman.2007@gmail.com', //Hacia adonde enviar
        subject: 'Mail de prueba', //asunto
        html: `<h1>Hola desde node js</h1>` //Body del mail
    }
)
    */

// Solo escuchar el puerto en desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const port = ENVIRONMENT.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port} 🚀`);
  });
}

export default app;