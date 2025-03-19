"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.orderProduct = void 0;
const orderService_1 = require("../service/orderService");
const orderProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { buyerId } = req.params;
    try {
        const result = yield (0, orderService_1.placeOrderService)(buyerId);
        if (!result) {
            res.status(400).json({ message: 'failed to place order ' });
            return;
        }
        console.log("orderId", result);
        res.status(201).json({ message: 'order placed successfully', data: result });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});
exports.orderProduct = orderProduct;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address } = req.body;
        const typedAddress = address;
        const result = yield (0, orderService_1.verifyPaymentService)(razorpay_order_id, razorpay_payment_id, razorpay_signature, typedAddress);
        if (!result) {
            res.status(400).json({ message: "Payment verification failed" });
            return;
        }
        res.status(200).json({ message: "payment completed success fully", });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'internal server error' });
    }
});
exports.verifyPayment = verifyPayment;
