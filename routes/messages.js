"use strict";

import { Router } from "express";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const fetchMessages = Router();

function formatTime(timestamp) {
    const date = new Date(timestamp);

    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    return date.toLocaleTimeString('en-US', options);
}

fetchMessages.get(
    "/messages",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const currentUserId = req.user.id;

        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { user1_id: currentUserId },
                    { user2_id: currentUserId },
                ],
            },
            include: {
                user1: true,
                user2: true,
                Messages: {
                    orderBy: { time: "desc" },
                    take: 1,
                },
            },
        });

        const formattedConversations = conversations.map((conv) => {
            const friend = conv.user1_id === currentUserId ? conv.user2 : conv.user1;
            const lastMessage = conv.Messages[0];

            return {
                id: conv.id,
                name: friend.name,
                lastText: lastMessage?.text || "",
                time: lastMessage ? formatTime(lastMessage.time) : "",
                image: friend.Avatar || "/default-avatar.png",
                verified: friend.role === "Alumni",
            };
        });

        const allMessages = await prisma.message.findMany({
            where: {
                conversation: {
                    OR: [
                        { user1_id: currentUserId },
                        { user2_id: currentUserId },
                    ],
                },
            },
            orderBy: { time: "asc" },
            include: {
                conversation: {
                    include: { user1: true, user2: true },
                },
            },
        });

        const formattedMessages = allMessages.map((msg) => {
            const sender =
                msg.sender_id === currentUserId ? "You" :
                    msg.conversation.user1_id === msg.sender_id ? msg.conversation.user1.name :
                        msg.conversation.user2.name;

            return {
                id: msg.conversationId, // <-- using conversationId here
                sender: sender,
                text: msg.text,
                time: formatTime(msg.time),
            };
        });

        //  console.log("dev");
        //console.log(formattedConversations, formattedMessages);
        res.json({ formattedConversations, formattedMessages });
        // res.json({ dev: "devendra" });
    }
);

export default fetchMessages;
