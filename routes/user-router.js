"use strict";

import { Router } from "express";
import passport from "passport";
import { deleteAchievements, deleteEducation, deleteExperience, deleteSkill, getProfileData, updateAchievements, updateEducation, updateExperience, updateProfileData, updateSkill } from "../controllers/user-controller.js";

const userRouter = Router();

userRouter.get("/:id", passport.authenticate("jwt", { session: false }), getProfileData);

userRouter.put("/profile", passport.authenticate("jwt", { session: false }), updateProfileData);

userRouter.put("/experience/update" ,  passport.authenticate("jwt", { session: false }), updateExperience);

userRouter.put("/experience/delete" ,  passport.authenticate("jwt", { session: false }), deleteExperience);

userRouter.put("/education/delete" ,  passport.authenticate("jwt", { session: false }), deleteEducation);

userRouter.put("/education/update" ,  passport.authenticate("jwt", { session: false }), updateEducation);

userRouter.put("/skill/update" ,  passport.authenticate("jwt", { session: false }), updateSkill);

userRouter.put("/skill/delete" ,  passport.authenticate("jwt", { session: false }), deleteSkill);

userRouter.put("/achievements/update" ,  passport.authenticate("jwt", { session: false }), updateAchievements);

userRouter.put("/achievements/delete" ,  passport.authenticate("jwt", { session: false }), deleteAchievements);

export default userRouter;
