import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()


export const connectDB=()=>{
    console.log(process.env.MONGOURL)
    const url=process.env.MONGOURL
    if (!url) {
        throw new Error("MONGOURL is not defined in environment variables");
      }
    mongoose.connect(url).then(()=>{
      
        console.log("data base connected")
        
    }).catch((error)=>{
        console.log(error)
        

    })

}
