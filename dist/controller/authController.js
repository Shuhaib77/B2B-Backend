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
exports.login = exports.register = void 0;
const authService_1 = require("../service/authService");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    console.log(name, email, password, role, "koko");
    if (!name || !email || !password || !role) {
        res.status(400).json({ message: "All fields are required" });
    }
    const data = yield (0, authService_1.registerService)(name, email, password, role);
    if (!data) {
        res.status(500).json({ message: "Registration failed" });
    }
    res.status(201).json({ message: "Registration successful", data: data });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "All fields are required" });
    }
    const data = yield (0, authService_1.loginService)(email, password);
    if (!data) {
        res.status(500).json({ message: "Login failed" });
    }
    res.status(201).json({ message: "Login successful", data: data });
});
exports.login = login;
