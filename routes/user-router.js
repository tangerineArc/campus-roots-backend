"use strict";

import { Router } from "express";
import passport from "passport";

import {
  acceptConnection,
  addConnection,
  getConnections,
  getProfileData,
  getProfileDataByName,
  getUserConversations,
  getUserMessagesWithOtherUser,
  removeConnection,
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

userRouter.get(
  "/name/:name",
  passport.authenticate("jwt", { session: false }),
  getProfileDataByName
)

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

userRouter.get(
  "/connections/:id",
  passport.authenticate("jwt", { session: false }),
  getConnections
);

userRouter.put(
  "/connections/add/:id1/:id2",
  passport.authenticate("jwt", { session: false }),
  addConnection,
);

userRouter.put(
  "/connections/remove/:id1/:id2",
  passport.authenticate("jwt", { session: false }),
  removeConnection,
);

userRouter.put(
  "/connections/accept/:id1/:id2",
  passport.authenticate("jwt", { session: false }),
  acceptConnection,
);


export default userRouter;
