import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

const postLikeController = async (req: Request, res: Response) => {
  const postId = req.params.postId as string;

  const postLike = await prisma.postLike.create({
    data: { postId }
  });

  res.status(200).json(postLike);
};

export { postLikeController };
