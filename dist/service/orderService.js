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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderByIdService = exports.getOrderService = exports.verifyPaymentService = exports.placeOrderService = void 0;
const User_1 = __importDefault(require("../models/User"));
const OrderSchema_1 = __importDefault(require("../models/OrderSchema"));
const dotenv_1 = __importDefault(require("dotenv"));
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = require("crypto");
const cartSchema_1 = __importDefault(require("../models/cartSchema"));
dotenv_1.default.config();
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const placeOrderService = (buyerId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const buyer = yield User_1.default.findById(buyerId)
        .populate({
        path: "cart",
        populate: { path: "productId" }
    });
    if (!buyer) {
        throw new Error("invalid seller or buyer ID");
    }
    if (!((_a = buyer.cart) === null || _a === void 0 ? void 0 : _a.length))
        return "Cart is empty ";
    let totalAmount = buyer.cart.reduce((total, item) => total + item.productId.price * item.quantity, 0);
    const productNames = buyer.cart.map((item) => item.productId.name).join(", ");
    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `order${Date.now()}`,
        notes: {
            buyerId,
            products: productNames,
        },
    };
    const order = yield razorpay.orders.create(options);
    return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
    };
});
exports.placeOrderService = placeOrderService;
const verifyPaymentService = (razorpay_order_id, razorpay_payment_id, razorpay_signature, address) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const generatedSignature = (0, crypto_1.createHmac)("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
    console.log("genaratedsignature", generatedSignature, "razorapysignature", razorpay_signature, address);
    if (generatedSignature !== razorpay_signature) {
        throw new Error("Payment verification failed");
    }
    const order = yield razorpay.orders.fetch(razorpay_order_id);
    const user = yield User_1.default.findById((_a = order === null || order === void 0 ? void 0 : order.notes) === null || _a === void 0 ? void 0 : _a.buyerId).populate({
        path: "cart",
        populate: { path: "productId" },
    });
    const newOrder = new OrderSchema_1.default({
        buyer: user === null || user === void 0 ? void 0 : user._id,
        products: (_b = user === null || user === void 0 ? void 0 : user.cart) === null || _b === void 0 ? void 0 : _b.map((item) => ({
            product: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price
        })),
        totalAmount: Number(order.amount) / 100,
        paymentStatus: "Completed",
        orderStatus: "Pending",
        address: address,
        invoiceId: razorpay_order_id,
    });
    if (user) {
        yield newOrder.save();
        (_c = user.orders) === null || _c === void 0 ? void 0 : _c.push(newOrder._id);
        user.cart = [];
        yield user.save();
    }
    yield cartSchema_1.default.deleteMany({ userId: user === null || user === void 0 ? void 0 : user._id });
    return newOrder;
});
exports.verifyPaymentService = verifyPaymentService;
const getOrderService = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield OrderSchema_1.default.find({ isDelete: false });
    if (!orders)
        throw new Error("filed to fetch orders");
    return orders;
});
exports.getOrderService = getOrderService;
const getOrderByIdService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield OrderSchema_1.default.findById(userId).populate({ path: 'orders' });
    if (!orders)
        throw new Error("filed to fetch orders");
    return orders;
});
exports.getOrderByIdService = getOrderByIdService;
