"use strict";

import { Router } from "express";
import passport from "passport";

import {
  sendProfileData,
  sendProtectedData,
} from "../controllers/index-controller.js";

const indexRouter = Router();

indexRouter.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  sendProtectedData
);

indexRouter.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  sendProfileData
);

export default indexRouter;
