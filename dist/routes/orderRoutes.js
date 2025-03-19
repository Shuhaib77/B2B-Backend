"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controller/orderController");
const router = express_1.default.Router();
router.post("/place-order/:buyerId", orderController_1.orderProduct);
router.post("/verify", orderController_1.verifyPayment);
exports.default = router;
