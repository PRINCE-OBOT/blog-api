import type { Request, Response } from "express";

const loginController = (req: Request, res: Response) => {
  res.json({ message: "Login page" });
};

export { loginController };
