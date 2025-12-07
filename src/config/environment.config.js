import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()


const ENVIRONMENT = {
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    GMAIL_USER: process.env.GMAIL_USER,
    PORT: process.env.PORT,
    URL_FRONTEND: process.env.URL_FRONTEND || 'https://mail-project-utn-2025-frontend.vercel.app',
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
    URL_BACKEND: process.env.URL_BACKEND || 'https://mail-project-utn-2025.vercel.app'
}


export default ENVIRONMENT