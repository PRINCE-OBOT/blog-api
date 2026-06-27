import { body, validationResult, matchedData } from "express-validator";
import type { Request, Response } from "express";

import { prisma } from "../lib/prisma";

const NOT_EMPTY_MSG = 'must not be empty'

const validateComment = [
  body("content").trim().notEmpty().withMessage(`Comment ${NOT_EMPTY_MSG}`),
  body("username").trim().notEmpty().withMessage(`Username ${NOT_EMPTY_MSG}`)
];

const commentController = [
  ...validateComment,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { content, username } = matchedData(req);
    const postId = req.body.postId;

    const post = await prisma.comment.create({
      data: { content, username, postId }
    });

    res.status(201).json(post);
  }
];

export { commentController };
