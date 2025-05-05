"use strict";

import { Router } from "express";
import passport from "passport";

import {
  getProfileData,
  getUserConversations,
  getUserMessagesWithOtherUser,
  updateAchievements,
  updateEducation,
  updateExperiences,
  updateProfileData,
  updateSkills,
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

userRouter.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getProfileData
);

userRouter.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  updateProfileData
);

userRouter.put(
  "/experiences",
  passport.authenticate("jwt", { session: false }),
  updateExperiences
);

userRouter.put(
  "/education",
  passport.authenticate("jwt", { session: false }),
  updateEducation
);

userRouter.put(
  "/skills",
  passport.authenticate("jwt", { session: false }),
  updateSkills
);

userRouter.put(
  "/achievements",
  passport.authenticate("jwt", { session: false }),
  updateAchievements
);

export default userRouter;
