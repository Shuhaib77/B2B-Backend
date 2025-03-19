import { Request, Response } from "express"
import { addToCartService, decrementQuantityService, incrementQuantityService, removeCartService, viewCartService } from "../service/cartService";
import { reduceEachTrailingCommentRange } from "typescript";


export const addToCart=async(req:Request,res:Response)=>{
 try {
    const {userId,productId}=req.params;
    
    const result=await addToCartService(userId,productId)
    if(!result) {
        res.status(400).json({message:"failed to addToCart the product"})
        return;
    }

    res.status(200).json({message:result})
 } catch (error) {
    res.status(500).json({message:"internal server error"})
 }
}

export const viewCart=async(req:Request,res:Response):Promise<void>=>{
    try {
        const {userId}=req.params;

        const result= await viewCartService(userId);

        if(!result){
            res.status(400).json({message:"failed to fetch cart"})
            return
        }

        res.status(200).json({message:"cart fetched successfully",cart:result})
    } catch (error) {
        console.log(error,'error');
        
        res.status(500).json({message:"internal server error",error:error})
    }
}



export const incrementQuantity=async (req:Request,res:Response):Promise<void>=>{
 const {userId,productId}=req.params;

 const result=await incrementQuantityService(userId,productId);
 if(!result){
   res.status(400).json({message:'filed to increment quantity'})
   return
 }

 res.status(200).json({message:result})
}


export const decrementQuantity=async (req:Request,res:Response)=>{
    const {userId,productId}=req.params;
   
    const result=await decrementQuantityService(userId,productId);
    if(!result){
       res.status(400).json({message:'filed to decrement quantity'})
       return
    }
   
    res.status(200).json({message:result})
   }


   export const removeCart=async (req:Request,res:Response)=>{
     try {
        const {userId,productId}=req.params;

        const result=await removeCartService(userId,productId)

        if(!result){
            res.status(400).json({message:"filed to remove cartItem"})
            return;
        }

        res.status(200).json({message:result})
     } catch (error) {
        res.status(500).json({message:'internal server error'})
     }

   }