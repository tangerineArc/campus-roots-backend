import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export default function configureChatSocket(io) {
  io.on("connection", (socket) => {
    socket.on(
      "register",
      expressAsyncHandler(async (userId) => {
        await prisma.userSocket.create({
          data: { userId, socketId: socket.id },
        });
      })
    );

    socket.on(
      "send-message",
      expressAsyncHandler(async ({ senderId, receiverId, text }) => {
        const message = await prisma.message.create({
          data: {
            senderId,
            receiverId,
            text,
            status: "UNREAD",
          },
        });

        const receiverSockets = await prisma.userSocket.findMany({
          where: { userId: receiverId },
        });

        receiverSockets.forEach(({ socketId }) => {
          io.to(socketId).emit("receive-message", message);
        });
      })
    );

    socket.on(
      "disconnect",
      expressAsyncHandler(async () => {
        await prisma.userSocket.deleteMany({ where: { socketId: socket.id } });
      })
    );
  });
}
