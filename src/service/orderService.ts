import User from "../models/User"
import Order, { IOrderAddress } from "../models/OrderSchema";
import dotenv from 'dotenv';
import Razorpay from "razorpay";
import { createHmac } from "crypto";
import Cart from "../models/cartSchema";


dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const placeOrderService=async(buyerId:string)=>{

    const buyer=await User.findById(buyerId)
    .populate({
        path:"cart",
        populate:{path:"productId"}
    })

    if(!buyer ){
        throw new Error("invalid seller or buyer ID")
    }
    if(!buyer.cart?.length) return "Cart is empty ";

    let totalAmount= buyer.cart.reduce((total, item:any) => total + item.productId.price * item.quantity, 0);
    const productNames = buyer.cart.map((item:any) => item.productId.name).join(", ");


    const options= {
        amount:totalAmount * 100,
        currency:"INR",
        receipt:`order${Date.now()}`,
        notes:{
            buyerId,
            products:productNames,
        },
    };

    const order=await razorpay.orders.create(options)
return {
    id:order.id,
    amount:order.amount,
    currency:order.currency,
};

 }


export const verifyPaymentService=async(
    razorpay_order_id:string, razorpay_payment_id:string, razorpay_signature:string,address:IOrderAddress)=>{

        const generatedSignature=
         createHmac("sha256", process.env.RAZORPAY_KEY_SECRET! )
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

        console.log("genaratedsignature",generatedSignature,"razorapysignature",razorpay_signature,address);
        

        if (generatedSignature !== razorpay_signature) {
            throw new Error("Payment verification failed") 
          }


        const order=await razorpay.orders.fetch(razorpay_order_id)
        const user=await User.findById(order?.notes?.buyerId).populate({
            path:"cart",
            populate:{path:"productId"},
        })

        const newOrder=new Order({
            buyer:user?._id,
            products:user?.cart?.map((item:any)=>({
                product:item.productId._id,
                quantity:item.quantity,
                price:item.productId.price
            })),
            totalAmount:Number(order.amount) / 100,
            paymentStatus:"Completed",
            orderStatus:"Pending",
            address:address,
            invoiceId:razorpay_order_id,
        });

        if(user){
        await newOrder.save()
        user.orders?.push(newOrder._id)
        user.cart=[]
        await user.save();
        }
        
        await Cart.deleteMany({userId:user?._id});

        return newOrder;
}



export const getOrderService=async()=>{
    const orders= await Order.find({isDelete:false});

    if(!orders) throw new Error("filed to fetch orders");

    return orders;

}


export const getOrderByIdService=async(userId:string)=>{
    const orders= await Order.findById(userId).populate({path:'orders'})

    if(!orders) throw new Error("filed to fetch orders");

    return orders;
}



