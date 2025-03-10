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
exports.deleteProductService = exports.getProductByIdService = exports.getProductService = exports.updateProductService = exports.addProductsService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Products_1 = __importDefault(require("../models/Products"));
const addProductsService = (name, description, price, category, stockQuantity, images, listedBy, listedByRole, wholesalePrice, minOrderQuantity) => __awaiter(void 0, void 0, void 0, function* () {
    const newProduct = new Products_1.default({
        name,
        description,
        price,
        category,
        stockQuantity,
        listedBy,
        listedByRole,
        images,
        wholesalePrice,
        minOrderQuantity,
    });
    yield newProduct.save();
    return newProduct;
});
exports.addProductsService = addProductsService;
const updateProductService = (productId, name, description, price, category, stockQuantity, images, listedBy, listedByRole, wholesalePrice, minOrderQuantity) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Products_1.default.findById(productId);
    if (!product) {
        throw new Error('product not found');
    }
    if (name)
        product.name = name;
    if (description)
        product.description = description;
    if (price)
        product.price = price;
    if (category)
        product.category = category;
    if (stockQuantity)
        product.stockQuantity = stockQuantity;
    if (images)
        product.images = images;
    if (listedBy)
        product.listedBy = listedBy;
    if (listedByRole)
        product.listedByRole = listedByRole;
    if (minOrderQuantity)
        product.minOrderQuantity = minOrderQuantity;
    yield product.save();
    return product;
});
exports.updateProductService = updateProductService;
const getProductService = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Products_1.default.find({ isDeleted: false });
    if (!products) {
        throw new Error("error to fetch data");
    }
    return products;
});
exports.getProductService = getProductService;
const getProductByIdService = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID format");
    }
    const product = yield Products_1.default.findById(productId);
    console.log(product, "Fetched product");
    // Check if the product exists and is not deleted
    if (!product || product.isDeleted) {
        throw new Error("Product not found or deleted");
    }
    return product;
});
exports.getProductByIdService = getProductByIdService;
const deleteProductService = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Products_1.default.findById(productId);
    if (!product) {
        throw new Error('product not found');
    }
    product.isDeleted = true;
    yield product.save();
    return "product deleted success fully";
});
exports.deleteProductService = deleteProductService;
