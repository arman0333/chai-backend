



// import { EventEmitter } from 'events';
// EventEmitter.defaultMaxListeners = 20; 
import dotenv from "dotenv"

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";



dotenv.config({
    path:"./env"
})

connectDB()
.then(()=>{
app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is running on port :${process.env.PORT || 8000}`)
})
})
.catch((err)=>{
    console.log("Connection failed with MONGODB")
})


/*
import express  from "express";
const app = express()
(async()=>{
    try{
      await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERRR:",error);
            throw error
        })
        app.lister(process.env.PORT,()=>{
            console.log(`App is listening on the port ${process.env.PORT}`)
        })
    }
    catch(error){
        console.log("Error :",error)
        throw err
    }
})()

*/
