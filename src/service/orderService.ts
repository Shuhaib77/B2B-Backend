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

// export interface orderProduct {
//     product:ObjectId,
//     quantity:number,
//     price:number
// }

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



//     for(let item of products){
//         const product=await Products.findById(item.product)
//         if(!product){
//             throw new Error("product not found")
//         }

//         if(product.stockQuantity< item.quantity){
//             return  `Not enough stock for ${product.name}.`
//         }

//         product.stockQuantity-=item.quantity;
//         await product.save();

//         totalAmount+=item.quantity * product.price;
//         productDetails.push({
//             product:product._id,
//             quantity: item.quantity,
//             price: product.price,
//         });
//     }

//     const invoiceId= `INV-${uuidv4().slice(0,8)}`;

//     const newOrder= new Order({
//         buyer:buyerId,
//         seller:sellerId,
//         products:productDetails,
//         totalAmount,
//         invoiceId,
//         address
//     });

//     await newOrder.save()

//     return {newOrder,message:'order created success fully '}

 }


export const verifyPaymentService=async(
    razorpay_order_id:string, razorpay_payment_id:string, razorpay_signature:string,address:IOrderAddress)=>{

        const generatedSignature=
         createHmac("sha256", process.env.RAZORPAY_KEY_SECRET! )
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

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
            paymentStatus:"completed",
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