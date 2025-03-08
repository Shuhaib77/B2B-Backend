import cloudinary from "cloudinary";
import multer from "multer";
import { Request, Response, NextFunction } from "express";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 20000000 } }); // Limit to 20MB

// Middleware to handle multiple image uploads
const uploadImages = (req: Request, res: Response, next: NextFunction) => {
  upload.array("images", 5)(req, res, async (error) => {
    if (error) {
      return res.status(400).json({ message: "File upload failed", error });
    }

    if (!req.files || !(req.files instanceof Array)) {
      next()
      return
    }

    try {
      const uploadPromises = (req.files as Express.Multer.File[]).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { resource_type: "image" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result?.secure_url || "");
            }
          );
          stream.end(file.buffer);
        });
      });

      // Wait for all images to be uploaded
      req.body.cloudinaryImageUrls = await Promise.all(uploadPromises);
      next();
    } catch (uploadError) {
      return res.status(500).json({ message: "Cloudinary upload failed", error: uploadError });
    }
  });
};

export default uploadImages;
