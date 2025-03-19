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
exports.loginService = exports.registerService = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//user registration
const secret = process.env.SECRET_KEY;
if (!secret) {
    throw new Error("secret key is enptyy");
}
const registerService = (name, email, password, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(name, email, password, role, "tttttt");
        const hashPass = yield bcryptjs_1.default.hash(password, 10);
        console.log(name, hashPass, "swseses");
        if (!name || !email || !password || !role) {
            throw new Error("user alredy Existss");
        }
        const checkUser = yield User_1.default.findOne({
            email: email,
        });
        if (checkUser) {
            throw new Error("user alredy Existss");
        }
        const newUser = new User_1.default({
            name,
            email,
            password: hashPass,
            role: role,
        });
        yield newUser.save();
        console.log(newUser, "jjjjj");
        return newUser;
    }
    catch (error) {
        console.log(error, 'error');
        throw new Error("ded");
    }
});
exports.registerService = registerService;
//user Login
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: email });
    if (!user) {
        throw new Error("user not finded");
    }
    const checkPass = yield bcryptjs_1.default.compare(password, user.password);
    if (!checkPass) {
        throw new Error("password auth failed");
    }
    const payload = {
        email: email,
        password: password,
    };
    const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "1h" });
    console.log(token);
    return { user, token };
});
exports.loginService = loginService;
