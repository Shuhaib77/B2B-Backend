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
exports.placeOrderService = void 0;
const Products_1 = __importDefault(require("../models/Products"));
const User_1 = __importDefault(require("../models/User"));
const uuid_1 = require("uuid");
const OrderSchema_1 = __importDefault(require("../models/OrderSchema"));
const placeOrderService = (buyerId, sellerId, products, address) => __awaiter(void 0, void 0, void 0, function* () {
    const buyer = yield User_1.default.findById(buyerId);
    const seller = yield User_1.default.findById(sellerId);
    if (!buyer || !seller) {
        throw new Error("invalid seller or buyer ID");
    }
    let totalAmount = 0;
    let productDetails = [];
    for (let item of products) {
        const product = yield Products_1.default.findById(item.product);
        if (!product) {
            throw new Error("product not found");
        }
        if (product.stockQuantity < item.quantity) {
            return `Not enough stock for ${product.name}.`;
        }
        product.stockQuantity -= item.quantity;
        yield product.save();
        totalAmount += item.quantity * product.price;
        productDetails.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price,
        });
    }
    const invoiceId = `INV-${(0, uuid_1.v4)().slice(0, 8)}`;
    const newOrder = new OrderSchema_1.default({
        buyer: buyerId,
        seller: sellerId,
        products: productDetails,
        totalAmount,
        invoiceId,
        address
    });
    yield newOrder.save();
    return { newOrder, message: 'order created success fully ' };
});
exports.placeOrderService = placeOrderService;
