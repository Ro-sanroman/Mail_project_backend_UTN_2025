import express from 'express'
import connectToMongoDB from './config/configMongoDB.config.js'
import mailTransporter from './config/mailTransporter.config.js'
import ENVIRONMENT from './config/environment.config.js'
import memberRouter from './routes/member.router.js'
import cors from 'cors'
import authRouter from './routes/auth.router.js'
import workspaceRouter from './routes/workspace.router.js'
import fs from 'fs'

const logStream = fs.createWriteStream('server.log', { flags: 'a' })

const log = (msg) => {
  console.log(msg)
  logStream.write(msg + '\n')
}

const app = express()
connectToMongoDB().catch(err => log('[STARTUP ERROR] ' + err))

app.use( cors() )

log('ENV CHECK: JWT_SECRET presente? ' + !!ENVIRONMENT.JWT_SECRET)


app.use(express.json())
app.use((req, res, next) => {
  log(`[PETICION RECIBIDA] ${req.method} ${req.url}`)
  next()
})

app.get('/api/test', (req, res) => {
  console.log('[TEST] GET /api/test - Server is responding!')
  res.json({ ok: true, message: 'Server is running', timestamp: new Date() })
})

app.use('/api/auth', authRouter)
app.use('/api/workspace', workspaceRouter)
app.use('/api/member', memberRouter)

app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR HANDLER]', err)
  res.status(500).json({
    ok: false,
    message: 'Error interno del servidor',
    status: 500,
    error: process.env.NODE_ENV !== 'production' ? err.message : undefined
  })
})

const port = ENVIRONMENT.PORT || 8080;
log(`[STARTUP] NODE_ENV = ${process.env.NODE_ENV || 'undefined'}, PORT = ${port}`)
const server = app.listen(port, () => {
  log(`Servidor corriendo en puerto ${port}`);
});

process.on('uncaughtException', (error) => {
  log('[UNCAUGHT EXCEPTION] ' + error)
})

process.on('unhandledRejection', (reason, promise) => {
  log('[UNHANDLED REJECTION] ' + reason)
})

server.on('error', (error) => {
  log('[SERVER ERROR] ' + error)
})

export default app;