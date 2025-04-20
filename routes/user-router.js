"use strict";

import { Router } from "express";
import passport from "passport";

import {
  getUserConversations,
  getUserMessagesWithOtherUser,
} from "../controllers/user-controller.js";

const userRouter = Router();

userRouter.get(
  "/conversations",
  passport.authenticate("jwt", { session: false }),
  getUserConversations
);

userRouter.get(
  "/messages/:otherUserId",
  passport.authenticate("jwt", { session: false }),
  getUserMessagesWithOtherUser
);

export default userRouter;
