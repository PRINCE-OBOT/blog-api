import jwt from "jsonwebtoken";

import type { Response } from "express";

import streamifier from "streamifier";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import cloudinary from "../lib/cloudinary.js";

interface User {
  id: string;
  username: string;
}

export function uploadToCloudinary(file: Express.Multer.File) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
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

export function jwtSign(user: User, res: Response) {
  jwt.sign(
    { user },
    process.env.JWT_SECRET!,
    (err: Error | null, token: string | undefined) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error occurred while generating token" });
      res.json({ token, user });
    }
  );
}
