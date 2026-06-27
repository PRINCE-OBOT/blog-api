import bcrypt from "bcryptjs";
import { body, validationResult, matchedData } from "express-validator";
import type { Request, Response } from "express";

import { prisma } from "../lib/prisma";

const alphaErr = "must contain only letters";

const validateSignUp = [
  body("firstName").trim().isAlpha().withMessage(`First name ${alphaErr}`),
  body("lastName").trim().isAlpha().withMessage(`Last name ${alphaErr}`),
  body("username")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters"),

  body("confirmPassword").custom((value: string, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password and confirm password did not match");
    }
    return true;
  })
];

const postController = [
  ...validateSignUp,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { firstName, lastName, username, password } = matchedData(req);

    const user = await prisma.user.findUnique({ where: { username } });

    if (user)
      return res.status(409).json({ error: "Account already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { firstName, lastName, username, password: hashedPassword }
    });

    res.redirect("/log-in");
  }
];


export { postController };
