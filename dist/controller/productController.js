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
exports.addProducts = void 0;
const Products_1 = __importDefault(require("../models/Products"));
const addProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = req.body;
    try {
        if (!product) {
            res.status(403).json({ message: 'validation error on vehicle' });
            return;
        }
        const images = req.body.cloudinaryImageUrls || [];
        const newProduct = new Products_1.default({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stockQuantity: product.stockQuantity,
            listedBy: product.listedBy,
            listedByRole: product.listedByRole,
            images: images,
            wholesalePrice: product.wholesalePrice,
            minOrderQuantity: product.minOrderQuantity,
        });
        yield newProduct.save();
        res.status(201).json({ message: 'product added successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
});
exports.addProducts = addProducts;
