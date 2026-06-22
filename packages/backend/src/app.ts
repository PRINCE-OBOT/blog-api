import "dotenv/config";

import express from "express";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

console.log(process.env.SECRET_KEY);
app.post("/login", (req, res) => {
  const user = {
    id: 1,
    username: "test",
    email: "test@example.com"
  };

  jwt.sign({ user }, "", (err: Error | null, token: string | undefined) => {
    if (err) return res.status(500).json({ error: "Error generating token" });
    res.json({ token });
  });
});

// Verify token and set it to local storage if valid
app.use(verifyToken);

app.get("/posts", (req, res) => {
  res.json({ message: "Post created" });
});

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) return res.sendStatus(401); // no token = not authenticated

  const [, token] = bearerHeader.split(" ");
  if (!token) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.SECRET_KEY!,
    (err: Error | null, authData: unknown) => {
      if (err) return res.sendStatus(403); // token invalid or expired
      next();
    }
  );
}

app.listen(process.env.PORT, () => {
  console.log(`Listening at http://localhost:${process.env.PORT}`);
});
