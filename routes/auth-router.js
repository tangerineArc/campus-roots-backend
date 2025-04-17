"use strict";

import { Router } from "express";
import passport from "passport";

import {
  sendAuthStatus,
  signInUser,
  signOutUser,
  signUpUser,
} from "../controllers/auth-controller.js";

const authRouter = Router();

authRouter.post("/sign-in", signInUser);
authRouter.post("/sign-out", signOutUser);
authRouter.post("/sign-up", signUpUser);

authRouter.get(
  "/status",
  passport.authenticate("jwt", { session: false }),
  sendAuthStatus
);

export default authRouter;
