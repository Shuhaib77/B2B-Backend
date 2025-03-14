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
exports.parseCSV = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const csvImageUploader_1 = require("../middeleware/csvImageUploader");
// Function to parse CSV file and return data
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on("data", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Ensure image URLs are split correctly
                const imageUrls = data.images ? data.images.split(",") : [];
                // Upload images to Cloudinary and wait for responses
                const uploadedImages = yield (0, csvImageUploader_1.uploadCSVImages)(imageUrls);
                results.push({
                    name: data.name,
                    description: data.description,
                    price: parseFloat(data.price),
                    category: data.category,
                    stockQuantity: parseInt(data.stockQuantity),
                    listedBy: data.listedBy,
                    listedByRole: data.listedByRole,
                    images: uploadedImages, // Now correctly stores string[]
                    wholesalePrice: data.wholesalePrice ? parseFloat(data.wholesalePrice) : undefined,
                    minOrderQuantity: data.minOrderQuantity ? parseInt(data.minOrderQuantity) : undefined,
                    ratings: [],
                    isDeleted: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
            catch (error) {
                reject(error);
            }
        }))
            .on("end", () => {
            resolve(results);
        })
            .on("error", (err) => {
            reject(err);
        });
    });
};
exports.parseCSV = parseCSV;
