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
exports.globel_errors = void 0;
const globel_errors = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(error);
    if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    if (error.name == "castError") {
        return res.status(400).json({ message: "invalid id format" });
    }
    if (error.name == "TokenExpirdError") {
        return res.status(400).json({
            message: "unauthorized: your token has expired plss Login again",
        });
    }
    if (error.name == "jsonWebTokenError") {
        return res.status(400).json({ mesage: "token expird" });
    }
    console.log(error.message);
    return res.status(500).json({ message: error });
});
exports.globel_errors = globel_errors;
