import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

export const homepageController = async (req: Request, res: Response) => {
  const authorId =
    typeof req.query.authorId === "string" ? req.query.authorId : undefined;

  const posts = await prisma.post.findMany({
    where: {
      ...(authorId ? { authorId } : {})
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      author: true,
      comments: true,
      likes: true
    }
  });

  res.json(posts);
};
