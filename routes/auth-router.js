"use strict";

import { Router } from "express";
import passport from "passport";

import {
  handleMicrosoftCallback,
  sendAuthStatus,
  signOutUser,
} from "../controllers/auth-controller.js";

const authRouter = Router();

authRouter.get("/microsoft", passport.authenticate("azure_oauth"));

authRouter.get(
  "/microsoft/callback",
  passport.authenticate("azure_oauth", {
    session: false,
    failureRedirect: "/auth/failed",
  }),
  handleMicrosoftCallback
);

authRouter.post("/sign-out", signOutUser);

authRouter.get(
  "/status",
  passport.authenticate("jwt", { session: false }),
  sendAuthStatus
);

export default authRouter;
