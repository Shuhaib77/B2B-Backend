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
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const Products_1 = __importDefault(require("./models/Products"));
const port = 5000;
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
io.on("connection", (socket) => {
    console.log("client connected");
    socket.on("requestStock", (productId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Stock request received for product ID: ${productId}`);
        const product = yield Products_1.default.findById(productId);
        if (product) {
            io.emit('stockUpdate', { productId, stock: product.stockQuantity });
        }
    }));
    socket.on("disconnect", () => {
        console.log("Clint Disconnected");
    });
});
