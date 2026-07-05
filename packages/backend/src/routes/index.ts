import { Router } from "express";

import * as post from "../controllers/postController";
import { homepageController } from "../controllers/homepageController";

const router = Router();

router.get("/posts", homepageController);

router.post("/post", post.postController);

router.put("/posts/:postId", post.updateController);

export { router };
