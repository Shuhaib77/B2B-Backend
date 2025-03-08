import mongoose, { ObjectId, Schema } from "mongoose";

export interface IUser {
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
    role: "wholesaler" | "retailer" | "seller";
    contactNumber: string;
    address: string;
    businessName?: string;
    stock?: IStockItem[]; 
    purchaseHistory?: IPurchaseHistoryItem[]; 
    products?: IProductItem[];
    isDeleted:Boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }


  export interface IStockItem {
    productId: ObjectId;
    quantity: number;
  } 


  export interface IPurchaseHistoryItem {
    productId: ObjectId;
    quantity: number;
    purchaseDate: Date;
  }

  export interface IProductItem {
    productId: ObjectId;
    price: number;
    stockQuantity: number;
  }

const userSchema = new Schema<IUser>({
  name:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
  },
  password:{
    type:String,
    required:true,
    minlength:6,
  },
  role:{
    type:String,
    enum:["wholesaler", "retailer", "seller"],
    required:true
  },
  contactNumber:{
    type:String,
    required:true,
  },
  address:{
    type:String,
    required:true,
  },
  businessName:{
    type:String,
    required:function(){
        return this.role!=="retailer";
    },
  },

  stock:[
    {
        productId:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
        quantity: Number,
    }
  ],

  purchaseHistory:[
    {
        productId:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
        quantity:Number,
        purchaseDate:{type:Date,default:Date.now},
    }
  ],

  products:[
    {
        productId:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
        price:Number,
        stockQuantity:Number,
    }
  ],
  isDeleted:{
    type:Boolean,
    default:false,
  }
},
{timestamps:true}
)

export default mongoose.model('User',userSchema);