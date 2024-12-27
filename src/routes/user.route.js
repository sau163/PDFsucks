import { Router } from "express";
import {
  userRegistration,
  userLogin,
  userLogout
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userSession } from "../middlewares/userSession.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(userRegistration);
userRouter.route("/login").post(userSession, userLogin);
userRouter.route("/logout").get(verifyJWT, userLogout);

export { userRouter };
