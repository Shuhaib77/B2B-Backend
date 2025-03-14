import { ObjectId } from "mongoose"
import Products from "../models/Products"
import User from "../models/User"
import {v4 as uuidv4} from 'uuid';
import Order from "../models/OrderSchema";

export interface orderProduct {
    product:ObjectId,
    quantity:number,
    price:number
}

export const placeOrderService=async(
    buyerId:string,sellerId:string,products:orderProduct[],address:string
   )=>{

    const buyer=await User.findById(buyerId)
    const seller=await User.findById(sellerId)

    if(!buyer || !seller){
        throw new Error("invalid seller or buyer ID")
    }

    let totalAmount=0;
    let productDetails=[];

    for(let item of products){
        const product=await Products.findById(item.product)
        if(!product){
            throw new Error("product not found")
        }

        if(product.stockQuantity< item.quantity){
            return  `Not enough stock for ${product.name}.`
        }

        product.stockQuantity-=item.quantity;
        await product.save();

        totalAmount+=item.quantity * product.price;
        productDetails.push({
            product:product._id,
            quantity: item.quantity,
            price: product.price,
        });
    }

    const invoiceId= `INV-${uuidv4().slice(0,8)}`;

    const newOrder= new Order({
        buyer:buyerId,
        seller:sellerId,
        products:productDetails,
        totalAmount,
        invoiceId,
        address
    });

    await newOrder.save()

    return {newOrder,message:'order created success fully '}

}