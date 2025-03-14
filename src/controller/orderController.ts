import { Request, Response } from "express";
import { placeOrderService } from "../service/orderService";


export const orderProduct=async(req:Request,res:Response) :Promise<void>=>{
  const {buyerId,sellerId,products,address}=req.body;
  try {
    const result= await placeOrderService(buyerId,sellerId,products,address)
    if(!result){
        res.status(400).json({message:'failed to place order '})
        return;
    }
        res.status(201).json({message:'order placed successfully'})
  } catch (error) {
    res.status(500).json({message:"internal server error"})
  }
}