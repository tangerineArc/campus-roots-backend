"use strict";

import { Router } from "express";
import passport from "passport";
import { addComment, addPost, getCommentsData, getLikesCount, getPostsData, toggleCommentLikes, togglePostLikes } from "../controllers/posts-controller.js";

const postsRouter = Router();

postsRouter.get(
  "/data",
  passport.authenticate("jwt", { session: false }),
  getPostsData
);

postsRouter.get(
  "/comments/:id",
  passport.authenticate("jwt", { session: false }),
  getCommentsData
);

postsRouter.put(
  "/comments/toggleLikes",
  passport.authenticate("jwt", { session: false }),
  toggleCommentLikes
);

postsRouter.get(
  "/comments/likes/:commentId",
  passport.authenticate("jwt", { session: false }),
  getLikesCount
);

postsRouter.put(
  "/like",
  passport.authenticate("jwt", { session: false }),
  togglePostLikes
);

postsRouter.put(
  "/add",
  passport.authenticate("jwt", { session: false }),
  addPost
);

postsRouter.put(
  "/add/comment",
  passport.authenticate("jwt", { session: false }),
  addComment
)

export default postsRouter;
