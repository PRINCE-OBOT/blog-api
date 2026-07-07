import type { NextFunction, Request, Response } from "express";
import { body, validationResult, matchedData } from "express-validator";
import multer from "multer";

import { prisma } from "../lib/prisma";
import { uploadToCloudinary } from "../utils/helper";

const storage = multer.memoryStorage();
const HERO_IMG_LIMIT = 1024 * 1024 * 5;

const upload = multer({ storage, limits: { fileSize: HERO_IMG_LIMIT } });

let hero_img_url =
  "https://res.cloudinary.com/dikpfkrli/image/upload/v1780727718/cld-sample-3.jpg";

const validatePost = [
  body("title").trim().notEmpty().withMessage("Title cannot be empty"),
  body("subtitle")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Subtitle not descriptive"),
  body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Content not descriptive"),
  body("published")
    .isBoolean()
    .toBoolean()
    .withMessage("Published status must be 'true' or 'false'")
];

const heroImgController = (req: Request, res: Response, next: NextFunction) => {
  upload.single("hero_img")(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Image must be less than 5MB" });
    }
    next();
  });
};

const postController = [
  heroImgController,
  ...validatePost,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title, content, subtitle, published } = matchedData(req);

    // fallback when hero_img is not selected by user

    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      hero_img_url = result.secure_url;
    }

    const post = await prisma.post.create({
      data: {
        title,
        subtitle,
        content,
        authorId: req.user.id,
        hero_img_url,
        published
      }
    });

    res.status(201).json(post);
  }
];

const getPostController = async (req: Request, res: Response) => {
  const postId = req.params.postId as string;

  const post = await prisma.post.findUnique({
    where: {
      id: postId
    },
    include: {
      author: true,
      comments: true,
      likes: true
    }
  });

  res.json(post);
};

const validateUpdatePost = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("subtitle")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Subtitle not descriptive"),
  body("content")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Content not descriptive"),
  body("published")
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage("Published status must be 'true' or 'false'")
];

const updateController = [
  heroImgController,
  ...validateUpdatePost,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title, content, subtitle, published } = matchedData(req);

    const postId = req.params.postId as string;

    let hero_img_url = req.body.hero_img;

    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      hero_img_url = result.secure_url;
    }

    const updatePost = await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(hero_img_url !== undefined && { hero_img_url }),
        ...(content !== undefined && { content }),
        ...(published !== undefined && { published })
      }
    });

    res.json(updatePost);
  }
];

const deleteController = async (req: Request, res: Response) => {
  const postId = req.params.postId as string;

  const post = await prisma.post.delete({
    where: {
      id: postId
    }
  });

  res.json(post);
};

export {
  postController,
  getPostController,
  updateController,
  deleteController
};
