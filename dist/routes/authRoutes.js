"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const tryCatch_1 = require("../middeleware/tryCatch");
const authRoute = express_1.default.Router();
authRoute.post("/register", authController_1.register);
authRoute.post("/login", (0, tryCatch_1.trycatch)(authController_1.login));
exports.default = authRoute;
