import type { Request, Response } from "express";

import { prisma } from "../lib/prisma";

const commentLikeController = async (req: Request, res: Response) => {
  const commentId = req.params.commentId as string;

  const commentLike = await prisma.commentLike.create({
    data: { commentId }
  });

  res.status(200).json(commentLike);
};

export { commentLikeController };
