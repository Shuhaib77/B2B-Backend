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
exports.deleteProduct = exports.getProductById = exports.getProduct = exports.updateProduct = exports.addProducts = void 0;
const productService_1 = require("../service/productService");
const addProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, category, stockQuantity, listedBy, listedByRole, wholesalePrice, minOrderQuantity, } = req.body;
    try {
        if (!name || !description || !price || !category || !stockQuantity || !listedBy || !listedByRole) {
            res.status(403).json({ message: 'validation error on vehicle' });
            return;
        }
        if (!["seller", "wholesaler"].includes(listedByRole)) {
            res.status(400).json({ message: "Invalid listedByRole. Must be 'seller' or 'wholesaler'" });
            return;
        }
        const images = req.body.cloudinaryImageUrls || [];
        const result = yield (0, productService_1.addProductsService)(name, description, price, category, stockQuantity, images, listedBy, listedByRole, wholesalePrice, minOrderQuantity);
        if (!result) {
            res.status(400).json({ message: "production creation failed " });
        }
        res.status(201).json({ message: 'product added successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'internal server error', error });
    }
});
exports.addProducts = addProducts;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const { name, description, price, category, stockQuantity, listedBy, listedByRole, wholesalePrice, minOrderQuantity, } = req.body;
    try {
        const images = req.body.cloudinaryImageUrls || [];
        const result = yield (0, productService_1.updateProductService)(productId, name, description, price, category, stockQuantity, images, listedBy, listedByRole, wholesalePrice, minOrderQuantity);
        if (!result) {
            res.status(400).json({ message: "failed to update product" });
            return;
        }
        res.status(200).json({ message: 'product updated successfully' });
    }
    catch (error) {
        console.log(error, "error");
        res.status(500).json({ message: "internal server error" });
    }
});
exports.updateProduct = updateProduct;
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, productService_1.getProductService)();
        if (!result) {
            res.status(400).json({ message: "products not found" });
            return;
        }
        res.status(200).json({ message: "product fetched success fully", data: result });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});
exports.getProduct = getProduct;
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    try {
        const result = yield (0, productService_1.getProductByIdService)(productId);
        if (!result) {
            res.status(400).json({ message: "products not found" });
            return;
        }
        res.status(200).json({ message: "product fetched success fully", data: result });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.getProductById = getProductById;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    try {
        const result = yield (0, productService_1.deleteProductService)(productId);
        if (!result) {
            res.status(400).json({ message: "failed to delete product" });
            return;
        }
        res.status(201).json({ message: result });
    }
    catch (error) {
        console.log(error, "error");
        res.status(500).json({ message: "internal server error " });
    }
});
exports.deleteProduct = deleteProduct;
