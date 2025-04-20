"use strict";

import { PrismaClient } from "@prisma/client";
import { getAllConversationsForUser } from "@prisma/client/sql";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const getUserConversations = expressAsyncHandler(async (req, res) => {
  const conversations = await prisma.$queryRawTyped(
    getAllConversationsForUser(req.user.id)
  );

  res.status(200).json({ success: true, conversations });
});

const getUserMessagesWithOtherUser = expressAsyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { otherUserId } = req.params;

  const messages = await prisma.message.findMany({
    where: {
      AND: [
        { OR: [{ senderId: otherUserId }, { receiverId: otherUserId }] },
        { OR: [{ senderId: userId }, { receiverId: userId }] },
      ],
    },
    include: { sender: true, receiver: true },
    orderBy: { time: "asc" },
  });

  res.status(200).json({ success: true, messages });
});

export { getUserConversations, getUserMessagesWithOtherUser };
