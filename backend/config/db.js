import mongoose from 'mongoose';
import dotenv from 'dotenv';    

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected!!!")
    }catch(error){
        console.log(error)
        process.exit(1); //code 1 is failure which means exit
    }
}
