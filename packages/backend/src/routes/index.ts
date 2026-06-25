import { Router } from "express";

import { loginController } from "../controllers/loginController.js";
import * as signup from "../controllers/signupController.js";

const router = Router();

router.get("/login", loginController);

router.get("/signup", signup.getController);

router.post("/signup", signup.postController);
     
export { router };
