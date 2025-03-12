import cloudinary from "cloudinary";
import multer from "multer";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 20000000 } }); // Limit to 20MB

export const uploadCSVImages = async (imageUrls: string[]): Promise<string[]> => {
  try {
    const uploadPromises = imageUrls.map((imageUrl) => {
      return new Promise<string>((resolve, reject) => {
        cloudinary.v2.uploader.upload(imageUrl, { resource_type: "image" }, (err, result) => {
          if (err) reject(err);
          else resolve(result?.secure_url || "");
        });
      });
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};

export const multerUpload = upload.single("csvFile");
