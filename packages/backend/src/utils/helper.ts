import streamifier from "streamifier";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

import cloudinary from "../lib/cloudinary";

export function uploadToCloudinary(file: Express.Multer.File) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "drive"
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

