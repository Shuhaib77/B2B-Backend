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
exports.multerUpload = exports.uploadCSVImages = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_1 = __importDefault(require("multer"));
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
// Configure multer for memory storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage, limits: { fileSize: 20000000 } }); // Limit to 20MB
const uploadCSVImages = (imageUrls) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadPromises = imageUrls.map((imageUrl) => {
            return new Promise((resolve, reject) => {
                cloudinary_1.default.v2.uploader.upload(imageUrl, { resource_type: "image" }, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        resolve((result === null || result === void 0 ? void 0 : result.secure_url) || "");
                });
            });
        });
        return yield Promise.all(uploadPromises);
    }
    catch (error) {
        throw new Error("Cloudinary upload failed");
    }
});
exports.uploadCSVImages = uploadCSVImages;
exports.multerUpload = upload.single("csvFile");
