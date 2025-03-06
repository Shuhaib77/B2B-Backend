"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = () => {
    console.log(process.env.MONGOURL);
    const url = process.env.MONGOURL;
    if (!url) {
        throw new Error("MONGOURL is not defined in environment variables");
    }
    mongoose_1.default.connect(url).then(() => {
        console.log("data base connected");
    }).catch((error) => {
        console.log(error);
    });
};
exports.connectDB = connectDB;
