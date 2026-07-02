import { prisma } from "../lib/prisma";
import type { Request, Response } from "express";

export const homepageController = async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: true,
      likes: true,
    }
  });

  res.json(posts);
};
