import express from "express"
import { orderProduct } from "../controller/orderController"

const router=express.Router()

router.post("/place-order",orderProduct)