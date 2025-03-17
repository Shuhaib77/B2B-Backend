import mongoose, { ObjectId } from "mongoose";

export interface ICart {
    _id?:ObjectId,
    userId:ObjectId;
    productId:ObjectId;
    quantity:number;
  }

const cartSchema = new mongoose.Schema<ICart>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    quantity:{
        type:Number,
        default:1
    }
})

const Cart=mongoose.model("Cart",cartSchema)
export default Cart;