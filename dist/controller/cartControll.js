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
exports.removeCart = exports.decrementQuantity = exports.incrementQuantity = exports.viewCart = exports.addToCart = void 0;
const cartService_1 = require("../service/cartService");
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.params;
        const result = yield (0, cartService_1.addToCartService)(userId, productId);
        if (!result) {
            res.status(400).json({ message: "failed to addToCart the product" });
            return;
        }
        res.status(200).json({ message: result });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});
exports.addToCart = addToCart;
const viewCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield (0, cartService_1.viewCartService)(userId);
        if (!result) {
            res.status(400).json({ message: "failed to fetch cart" });
        }
        res.status(200).json({ message: "cart fetched successfully", cart: result });
    }
    catch (error) {
        console.log(error, 'error');
        res.status(500).json({ message: "internal server error", error: error });
    }
});
exports.viewCart = viewCart;
const incrementQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId } = req.params;
    const result = yield (0, cartService_1.incrementQuantityService)(userId, productId);
    if (!result) {
        res.status(400).json({ message: 'filed to increment quantity' });
    }
    res.status(200).json({ message: result });
});
exports.incrementQuantity = incrementQuantity;
const decrementQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId } = req.params;
    const result = yield (0, cartService_1.decrementQuantityService)(userId, productId);
    if (!result) {
        res.status(400).json({ message: 'filed to decrement quantity' });
    }
    res.status(200).json({ message: result });
});
exports.decrementQuantity = decrementQuantity;
const removeCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.params;
        const result = yield (0, cartService_1.removeCartService)(userId, productId);
        if (!result) {
            res.status(400).json({ message: "filed to remove cartItem" });
        }
        res.status(200).json({ message: result });
    }
    catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
});
exports.removeCart = removeCart;
