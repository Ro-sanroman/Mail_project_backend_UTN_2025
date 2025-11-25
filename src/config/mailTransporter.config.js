import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

console.log('[MAIL CONFIG] cargando mailTransporter.config.js')
console.log('[MAIL CONFIG] ENV vars:', {
  GMAIL_USER: !!ENVIRONMENT.GMAIL_USER,
  GMAIL_PASSWORD: !!ENVIRONMENT.GMAIL_PASSWORD,
  PORT: ENVIRONMENT.PORT ?? 'no-port'
})

const mailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: ENVIRONMENT.GMAIL_USER,
    pass: ENVIRONMENT.GMAIL_PASSWORD
  },
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  tls: {
    rejectUnauthorized: false
  }
})

mailTransporter.verify()
  .then(() => {
    console.log('Mail transporter conectado y listo')
  })
  .catch(err => {
    console.error('Mail transporter ERROR:', err && (err.stack || err))
  })

export default mailTransporter