import express from "express"
import { getOrders, getOrdersById, orderProduct, verifyPayment } from "../controller/orderController"

const router=express.Router()

router.post("/place-order/:buyerId",orderProduct)
router.post("/verify",verifyPayment);
router.get("orders",getOrders)
router.get("orders/:userId",getOrdersById)

export default router