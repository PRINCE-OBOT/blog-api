import type { NextFunction, Request, Response } from "express";
import { body, validationResult, matchedData } from "express-validator";
import multer from "multer";

import { prisma } from "../lib/prisma";
import { uploadToCloudinary } from "../utils/helper";

const storage = multer.memoryStorage();

const HERO_IMG_LIMIT = 1024 * 1024 * 5;

const upload = multer({ storage, limits: { fileSize: HERO_IMG_LIMIT } });

const validatePost = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title cannot be empty"),
  body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Content not descriptive")
];

const postController = [
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("hero_img")(req, res, (err) => {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "Image must be less than 5MB" });
      }
      next();
    });
  },
  ...validatePost,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title, content } = matchedData(req);
    const published = req.body.published === 'true' ? true : false

    // fallback when hero_img is not provided
    let hero_img_url =
      "https://res.cloudinary.com/dikpfkrli/image/upload/v1780727718/cld-sample-3.jpg";

    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      hero_img_url = result.secure_url;
    }

    const post = await prisma.post.create({
      data: { title, content, authorId: req.user.id, hero_img_url, published }
    });

    res.status(201).json(post);
  }
];

export { postController };
