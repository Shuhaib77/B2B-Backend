import { Request, Response } from "express";
import { placeOrderService, verifyPaymentService } from "../service/orderService";
import { IOrderAddress } from '../models/OrderSchema';


export const orderProduct=async(req:Request,res:Response) :Promise<void>=>{
  const {buyerId}=req.params;
  try {
    const result= await placeOrderService(buyerId)
    if(!result){
        res.status(400).json({message:'failed to place order '})
        return;
    }
    console.log("orderId",result);
    
        res.status(201).json({message:'order placed successfully',data:result})
  } catch (error) {
    res.status(500).json({message:"internal server error"})
  }
}


export const verifyPayment=async (req:Request,res:Response):Promise<void>=>{

  try {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature,address}=req.body 

    const typedAddress:IOrderAddress=address as unknown as IOrderAddress;
    const result=await verifyPaymentService(razorpay_order_id, razorpay_payment_id, razorpay_signature,typedAddress);
    if(!result){
      res.status(400).json({message:"Payment verification failed"})
      return;
    }
    res.status(200).json({message:"payment completed success fully",})
    
  } catch (error) {
    console.log("error",error);
    res.status(500).json({message:'internal server error'})
  }
}