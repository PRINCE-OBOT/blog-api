import { Router } from "express";

import { postController } from "../controllers/postController";
import { commentController } from "../controllers/commentController";

const router = Router();

router.post("/post", postController);

router.post("/comment", commentController);

export { router };
