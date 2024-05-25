
import mongoose, { Schema } from "mongoose";


const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,   
        // one who is subcribing 
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,   
        // one who is subcribed 
        ref:"User"
    }
},{timestamps:true});


export const Subsciption = mongoose.model("Subscription",subscriptionSchema);