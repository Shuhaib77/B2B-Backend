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
exports.removeCartService = exports.decrementQuantityService = exports.incrementQuantityService = exports.viewCartService = exports.addToCartService = void 0;
const cartSchema_1 = __importDefault(require("../models/cartSchema"));
const Products_1 = __importDefault(require("../models/Products"));
const User_1 = __importDefault(require("../models/User"));
const addToCartService = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User_1.default.findById(userId);
    if (!user)
        throw new Error("user not found");
    const product = yield Products_1.default.findById(productId);
    if (!product)
        throw new Error("product not found");
    let itemCart = yield cartSchema_1.default.findOne({ userId: userId, productId: productId });
    if (itemCart) {
        itemCart.quantity++;
        yield itemCart.save();
        return "product quantity increment ";
    }
    else {
        itemCart = yield cartSchema_1.default.create({
            userId,
            productId,
            quantity: 1
        });
        (_a = user.cart) === null || _a === void 0 ? void 0 : _a.push(itemCart._id);
        yield user.save();
        return 'product add to cart successfully';
    }
});
exports.addToCartService = addToCartService;
const viewCartService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(userId)
        .populate({
        path: "cart",
        populate: { path: "productId" }
    });
    if (!user)
        throw new Error("user not found ");
    if (!user.cart || user.cart.length === 0) {
        return "your cart is empty ";
    }
    return user;
});
exports.viewCartService = viewCartService;
const incrementQuantityService = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(userId);
    if (!user)
        throw new Error("user not found");
    const product = yield Products_1.default.findById(productId);
    if (!product)
        throw new Error("product not found");
    const cartItem = yield cartSchema_1.default.findOne({ userId: userId, productId: productId });
    if (!cartItem) {
        throw new Error("cart not found ");
    }
    cartItem.quantity++;
    yield cartItem.save();
    return "quantity incremented";
});
exports.incrementQuantityService = incrementQuantityService;
const decrementQuantityService = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(userId);
    if (!user)
        throw new Error("user not found");
    const product = yield Products_1.default.findById(productId);
    if (!product)
        throw new Error("product not found");
    const cartItem = yield cartSchema_1.default.findOne({ userId: userId, productId: productId });
    if (!cartItem) {
        throw new Error("cart not found ");
    }
    if (cartItem.quantity > 1) {
        cartItem.quantity--;
        yield cartItem.save();
        return "quantity decremented";
    }
});
exports.decrementQuantityService = decrementQuantityService;
const removeCartService = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield User_1.default.findById(userId);
    if (!user)
        throw new Error("user not found");
    const product = yield Products_1.default.findById(productId);
    if (!product)
        throw new Error("product not found");
    const cartItem = yield cartSchema_1.default.findOneAndDelete({ userId, productId });
    if (!cartItem) {
        throw new Error("Product not found in user cart");
    }
    const userCartIndex = (_a = user.cart) === null || _a === void 0 ? void 0 : _a.findIndex((item) => item && item.equals(cartItem._id));
    if (userCartIndex !== -1 && userCartIndex !== undefined) {
        (_b = user.cart) === null || _b === void 0 ? void 0 : _b.splice(userCartIndex, 1);
        yield user.save();
    }
    return 'cart removed success fully';
});
exports.removeCartService = removeCartService;
