import express from "express"
import { orderProduct, verifyPayment } from "../controller/orderController"

const router=express.Router()

router.post("/place-order/:buyerId",orderProduct)
router.post("/verify",verifyPayment);

export default router