

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";    


 const connectDB = async () =>{
    try{
       const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`DB is connected ${connectionInstance.connection.host}`)
        }
    catch(error){
        console.log("DB is not connected")
        console.log("Error:",error.message);
        process.exit(1);
    }
}

export default connectDB;