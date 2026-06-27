import "dotenv/config";

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

const app = express();

const INVALID_LOGIN_MSG = "Invalid username or password";

app.use(express.urlencoded({ extended: false }));

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) return res.status(401).json({ message: INVALID_LOGIN_MSG });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: INVALID_LOGIN_MSG });

  jwt.sign(
    { user },
    process.env.JWT_SECRET!,
    (err: Error | null, token: string | undefined) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error occurred while generating token" });
      res.json({ token });
    }
  );
});

app.get("/login", loginController);

app.post("/signup", signup.postController);

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

app.listen(process.env.PORT, () => {
  console.log(`Listening at http://localhost:${process.env.PORT}`);
});
