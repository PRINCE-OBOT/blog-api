import { Router } from "express";

import * as post from "../controllers/postController";

const router = Router();

router.post("/post", post.postController);

router.put("/posts/:postId", post.updateController);

export { router };
