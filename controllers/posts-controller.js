"use strict";

import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const getPostsData = expressAsyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error fetching posts : ", error);
    res.status(500).json({ success: false, error: error.message });
  }
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

const getPosts = expressAsyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
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
  } catch (error) {
    console.error("Error fetching posts : ", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

async function deleteComments(commentId, prisma) {
  const getReplyIds = async (parentId) => {
    const replies = await prisma.comment.findMany({
      where: {
        parentCommentId: parentId
      },
      select: {
        id: true
      },
    });

    const replyIds = [];

    for (const reply of replies) {
      replyIds.push(reply.id);
      const nestedReplies = await getReplyIds(reply.id);
      replyIds.push(...nestedReplies);
    }

    return replyIds;
  };

  const replyIds = await getReplyIds(commentId);

  if (replyIds.length > 0) {
    await prisma.commentLike.deleteMany({
      where: {
        commentId: {
          in: replyIds
        },
      },
    });

    await prisma.comment.deleteMany({
      where: {
        id: {
          in: replyIds
        },
      },
    });
  }

  await prisma.commentLike.deleteMany({
    where: {
      commentId
    },
  });

  await prisma.comment.delete({
    where: {
      id: commentId
    },
  });
}


const deletePost = expressAsyncHandler(async (req, res) => {
  const postId = req.params.id;

  try {
    await prisma.postLike.deleteMany({
      where: {
        postId: postId,
      },
    });

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      select: {
        id: true,
      },
    });

    for (const comment of comments) {
      await deleteComments(comment.id, prisma);
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in deleting post : ", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const deleteComment = expressAsyncHandler(async (req, res) => {
  const commentId = req.params.id;

  try {
    await deleteComments(commentId, prisma);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});



export { addComment, addPost, deleteComment, deletePost, getCommentsData, getLikesCount, getPosts, getPostsData, toggleCommentLikes, togglePostLikes };

