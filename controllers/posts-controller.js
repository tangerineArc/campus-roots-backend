"use strict";

import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const getPostsData = expressAsyncHandler(async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
          about: true
        }
      },
      media: true,
      likes: true,
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              about: true
            }
          }
        }
      }
    }
  });
  res.status(200).json({ success: true, posts });
});

const getCommentsData = expressAsyncHandler(async (req, res) => {
  const postId = req.params.id;
  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      post: true,
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          about: true
        }
      },
      parent: true,
      children: true,
      likes: true,
    },
  });
  res.status(200).json({ success: true, comments });
});

const toggleCommentLikes = expressAsyncHandler(async (req, res) => {
  const { userId, commentId } = req.body;

  try {
    const existingLike = await prisma.commentLike.findFirst({
      where: {
        userId: userId,
        commentId: commentId,
      },
    });

    if (existingLike) {
      await prisma.commentLike.deleteMany({
        where: {
          userId,
          commentId,
        },
      });
      res.json({ success: true, liked: false });
    } else {
      await prisma.commentLike.create({
        data: {
          userId,
          commentId,
        },
      });
      res.json({ success: true, liked: true });
    }
  } catch (error) {
    console.error("Error in toggleCommentLikes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


const getLikesCount = expressAsyncHandler(async (req, res) => {
  const { commentId } = req.params;
  try {
    const likes = await prisma.commentLike.findMany({
      where: {
        commentId: commentId
      },
    });
    return res.status(200).json({ success: true, likesCount: likes.length });
  } catch (error) {
    console.error("Error fetching likes : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const togglePostLikes = expressAsyncHandler(async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const existingLike = await prisma.postLike.findFirst({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    if (existingLike) {
      await prisma.postLike.deleteMany({
        where: {
          userId,
          postId,
        },
      });
      res.json({ success: true, liked: false });
    } else {
      await prisma.postLike.create({
        data: {
          userId,
          postId,
        },
      });
      res.json({ success: true, liked: true });
    }
  } catch (error) {
    console.error("Error in toggleCommentLikes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const addPost = expressAsyncHandler(async (req, res) => {
  const { body, userId } = req.body;
  try {
    await prisma.post.create({
      data: {
        body: body,
        userId: userId
      }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in toggleCommentLikes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const addComment = expressAsyncHandler(async (req, res) => {
  const { body, parentCommentId, postId, userId } = req.body;

  try {
    await prisma.comment.create({
      data: {
        body: body,
        parentCommentId: parentCommentId,
        userId: userId,
        postId: postId,
      },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in adding comment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


export { addComment, addPost, getCommentsData, getLikesCount, getPostsData, toggleCommentLikes, togglePostLikes };

