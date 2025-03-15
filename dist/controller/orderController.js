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
exports.orderProduct = void 0;
const orderService_1 = require("../service/orderService");
const orderProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { buyerId, sellerId, products, address } = req.body;
    try {
        const result = yield (0, orderService_1.placeOrderService)(buyerId, sellerId, products, address);
        if (!result) {
            res.status(400).json({ message: 'failed to place order ' });
            return;
        }
        res.status(201).json({ message: 'order placed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});
exports.orderProduct = orderProduct;
