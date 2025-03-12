import fs from "fs";
import csv from "csv-parser";
import { IProduct } from "../models/Products";
import { uploadCSVImages } from "../middeleware/csvImageUploader";

// Function to parse CSV file and return data
export const parseCSV = (filePath: string): Promise<IProduct[]> => {
    return new Promise((resolve, reject) => {
      const results: IProduct[] = [];
  
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", async (data) => {
          try {
            // Ensure image URLs are split correctly
            const imageUrls = data.images ? data.images.split(",") : [];
  
            // Upload images to Cloudinary and wait for responses
            const uploadedImages = await uploadCSVImages(imageUrls);
  
            results.push({
              name: data.name,
              description: data.description,
              price: parseFloat(data.price),
              category: data.category,
              stockQuantity: parseInt(data.stockQuantity),
              listedBy: data.listedBy,
              listedByRole: data.listedByRole as "seller" | "wholesaler",
              images: uploadedImages, // Now correctly stores string[]
              wholesalePrice: data.wholesalePrice ? parseFloat(data.wholesalePrice) : undefined,
              minOrderQuantity: data.minOrderQuantity ? parseInt(data.minOrderQuantity) : undefined,
              ratings: [],
              isDeleted: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          } catch (error) {
            reject(error);
          }
        })
        .on("end", () => {
          resolve(results);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  };