import { Router } from "express";

import * as post from "../controllers/postController.js";
import { homepageController } from "../controllers/homepageController.js";

const router = Router();

router.get("/posts", homepageController);

router.post("/post", post.postController);

router.put("/posts/:postId", post.updateController);

router.delete("/posts/:postId", post.deleteController);

export { router };
