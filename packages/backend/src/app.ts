import "dotenv/config";

import cors from "cors";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { router } from "./routes/index";
import { prisma } from "./lib/prisma";
import { loginController } from "./controllers/loginController";
import * as signup from "./controllers/signupController";
import { commentController } from "./controllers/commentController";
import { commentLikeController } from "./controllers/commentLikeController";
import { postLikeController } from "./controllers/postLikeController";
import { homepageController } from "./controllers/homepageController";
import { getPostController } from "./controllers/postController";
import { jwtSign } from "./utils/helper";

const app = express();

const INVALID_LOGIN_MSG = "Invalid username or password";

app.use(
  cors({
    origin: [
      "http://localhost:5173", // frontend local dev
      "http://localhost:5174", // frontend local dev
      process.env.READER_FRONTEND_URL!, // frontend production
      process.env.AUTHOR_FRONTEND_URL!, // frontend production
    ]
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // ✅ also add this — needed to read req.body as JSON

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) return res.status(401).json({ message: INVALID_LOGIN_MSG });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: INVALID_LOGIN_MSG });

  jwtSign(user, res);
});

app.get("/login", loginController);

app.post("/signup", signup.postController);

app.get("/", homepageController);

app.get("/posts/:postId", getPostController);

app.post("/posts/:postId/comment", commentController);

app.post("/posts/:postId/like", postLikeController);

app.post("/comments/:commentId/like", commentLikeController);

// Verify token and set it to local storage if valid
app.use(verifyToken);

app.use("/", router);

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) return res.sendStatus(401); // no token = not authenticated

  const [, token] = bearerHeader.split(" ");
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as Express.JWTPayload;

    req.user = payload.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export default app
