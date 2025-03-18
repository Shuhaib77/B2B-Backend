import mongoose, { ObjectId } from "mongoose";
import { Types } from "mongoose";

export interface IOrderProduct {
  product: Types.ObjectId; // Reference to Product
  quantity: number;
  price: number;
}

export interface IOrderAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface IOrder {
  _id?: ObjectId;
  buyer: Types.ObjectId; // Reference to User
  seller: Types.ObjectId; // Reference to User
  products: IOrderProduct[];
  totalAmount: number;
  paymentStatus: "Pending" | "Completed" | "Failed" | "Refunded";
  orderStatus: "Pending" | "Approved" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  address?: IOrderAddress;
  invoiceId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", 
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    invoiceId: {
      type: String, 
      unique: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
