import type { Request, Response, NextFunction } from "express";

function isUserController(req: Request, res: Response, next: NextFunction) {
  console.log(req.user)
  if (!req.user) return res.status(401).redirect("/login");

  next();
}

export { isUserController };
