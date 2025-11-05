import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = `${process.env.MONGO_DB_CONNECTION_STRING}?retryWrites=true&w=majority`;
console.log("URI:", uri);
export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Conexion con Mongo DB exitosa!");
  } catch (error) {
    console.error("Error al conectar a Mongo DB:", error.message);
  }
};

export default connectToMongoDB;