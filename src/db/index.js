import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({
    path: "./.env"
})

console.log("process", process.env.MONGO_URI);


export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to MongoDB: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}