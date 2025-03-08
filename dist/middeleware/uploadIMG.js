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
// Middleware to handle multiple image uploads
const uploadImages = (req, res, next) => {
    upload.array("images", 5)(req, res, (error) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return res.status(400).json({ message: "File upload failed", error });
        }
        if (!req.files || !(req.files instanceof Array)) {
            return res.status(400).json({ message: "No images provided" });
        }
        try {
            const uploadPromises = req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary_1.default.v2.uploader.upload_stream({ resource_type: "image" }, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve((result === null || result === void 0 ? void 0 : result.secure_url) || "");
                    });
                    stream.end(file.buffer);
                });
            });
            // Wait for all images to be uploaded
            req.body.cloudinaryImageUrls = yield Promise.all(uploadPromises);
            next();
        }
        catch (uploadError) {
            return res.status(500).json({ message: "Cloudinary upload failed", error: uploadError });
        }
    }));
};
exports.default = uploadImages;
