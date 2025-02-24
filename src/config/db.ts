import mongoose from "mongoose";



export const connectDB=()=>{
    mongoose.connect("mongodb://localhost:27017/B2B").then(()=>{
        console.log("data base connected")
        
    }).catch((error)=>{
        console.log(error)
        

    })

}
