"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadIMG_1 = __importDefault(require("../middeleware/uploadIMG"));
const productController_1 = require("../controller/productController");
const router = express_1.default.Router();
router.post("/products", uploadIMG_1.default, productController_1.addProducts);
router.put("/products/:productId", uploadIMG_1.default, productController_1.updateProduct);
router.get("/products", productController_1.getProduct);
router.get("/products/:productId", productController_1.getProductById);
router.delete("/products/:productId", productController_1.deleteProduct);
exports.default = router;
