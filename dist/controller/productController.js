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
exports.listedByGetProduct = exports.reduceStock = exports.fetchStock = exports.importCSVController = exports.deleteProduct = exports.getProductById = exports.getProduct = exports.updateProduct = exports.addProducts = void 0;
const productService_1 = require("../service/productService");
const addProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { listedBy } = req.params;
    const { name, description, price, category, stockQuantity, listedByRole, wholesalePrice, minOrderQuantity, } = req.body;
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
const importCSVController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: "No file uploaded" });
            return;
        }
        const result = yield (0, productService_1.importCSVService)(req.file.path);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.importCSVController = importCSVController;
const fetchStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const product = yield (0, productService_1.getLiveStock)(productId);
        if (!product)
            return res.status(404).json({ message: "product not found" });
        res.status(200).json({ productId, stock: product.stockQuantity });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});
exports.fetchStock = fetchStock;
const reduceStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        if (!quantity || quantity < 0)
            return res.status(400).json({ message: "invalid quantity" });
        const updatedProduct = yield (0, productService_1.updateStock)(productId, quantity);
        if (!exports.updateProduct)
            return res.status(404).json({ message: "product not found" });
        res.json({ message: "stock updated", stock: updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.stockQuantity }).status(200);
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});
exports.reduceStock = reduceStock;
const listedByGetProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listedBy } = req.params;
        if (!listedBy) {
            res.status(400).json({ message: 'missing required field' });
            return;
        }
        const result = yield (0, productService_1.listedByGetProductService)(listedBy);
        if (!result) {
            res.status(400).json({ message: "failed to fetch products" });
        }
        res.status(200).json({ message: 'product fetched success fully', products: result });
    }
    catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
});
exports.listedByGetProduct = listedByGetProduct;
