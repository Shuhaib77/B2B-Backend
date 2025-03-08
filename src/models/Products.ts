import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IProduct extends Document {
  name:String,
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  listedBy: ObjectId; 
  listedByRole: "seller" | "wholesaler"; 
  images: string[];
  wholesalePrice?: number;
  minOrderQuantity?: number;
  ratings:{
    user:ObjectId;
    rating:String;
    review:String;
  }[];
  isDeleted:Boolean;
  createdAt:Date;
  updatedAt:Date;
}


const ProductSchema:Schema=new Schema<IProduct>({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stockQuantity: { type: Number, required: true },
    listedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    listedByRole:{
        type:String,
        enum:["seller","wholesaler"],
        required:true,
    },
    images:{
        type:[String],
        required:true,
    },
    wholesalePrice: { type: Number, default: null },
    minOrderQuantity: { type: Number, default: 1 },
    ratings: [
        {
          user: { type: Schema.Types.ObjectId, ref: "User", required: true },
          rating: { type: Number, required: true, min: 1, max: 5 },
          review: { type: String, required: true },
        },
      ],
    isDeleted:{
      type:Boolean,
      default:false
    }
},{timestamps:true})


export default mongoose.model<IProduct>("Product",ProductSchema)