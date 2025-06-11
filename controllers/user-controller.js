"use strict";

import { PrismaClient } from "@prisma/client";
import { getAllConversationsForUser } from "@prisma/client/sql";
import expressAsyncHandler from "express-async-handler";

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const prisma = new PrismaClient();

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, "..", "prisma", "sql", "getAllConversationsForUser.sql"), "utf-8");

const getUserConversations = expressAsyncHandler(async (req, res) => {
  const conversations = await prisma.$queryRawUnsafe(sql, req.user.id);

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

const getProfileData = expressAsyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: {
      experiences: true,
      education: true,
      skills: true,
      achievements: true,
    },
  });

  res.status(200).json({ success: true, user });
});

const getProfileDataByName = expressAsyncHandler(async (req, res) => {
  const user = await prisma.user.findMany({
    where: {
      name: {
        contains: req.params.name,
        mode: "insensitive",
      },
    },
    include: {
      experiences: true,
      education: true,
      skills: true,
      achievements: true,
    },
  });

  res.status(200).json({ success: true, user });
});


const updateProfileData = expressAsyncHandler(async (req, res) => {
  const { name, about, avatar } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, about, avatar },
  });
  res.status(200).json({ success: true, user: updatedUser });
});

const updateExperiences = expressAsyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { experiences } = req.body;

  await prisma.experience.deleteMany({ where: { userId } });

  await Promise.all(
    experiences.map(
      ({ organization, title, startMonth, startYear, endMonth, endYear }) =>
        prisma.experience.create({
          data: {
            organization,
            title,
            startMonth,
            startYear,
            endMonth,
            endYear,
            userId,
          },
        })
    )
  );

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { experiences: true },
  });

  res.status(200).json({ success: true, user: updatedUser });
});

const updateEducation = expressAsyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { education } = req.body;

  await prisma.education.deleteMany({ where: { userId } });

  await Promise.all(
    education.map(
      ({ school, degree, startMonth, startYear, endMonth, endYear }) =>
        prisma.education.create({
          data: {
            school,
            degree,
            startMonth,
            startYear,
            endMonth,
            endYear,
            userId,
          },
        })
    )
  );

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { education: true },
  });

  res.status(200).json({ success: true, user: updatedUser });
});

const updateSkills = expressAsyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { skills } = req.body;

  await prisma.skill.deleteMany({ where: { userId } });

  await Promise.all(
    skills.map(({ label }) =>
      prisma.skill.create({
        data: { label, userId },
      })
    )
  );

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { skills: true },
  });

  res.status(200).json({ success: true, user: updatedUser });
});

const updateAchievements = expressAsyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { achievements } = req.body;

  await prisma.achievement.deleteMany({ where: { userId: userId } });

  await Promise.all(
    achievements.map(({ title, description, month, year }) =>
      prisma.achievement.create({
        data: {
          title,
          description,
          month,
          year,
          userId,
        },
      })
    )
  );

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { achievements: true },
  });

  res.status(200).json({ success: true, user: updatedUser });
});

const getConnections = expressAsyncHandler(async (req, res) => {
  const userId = req.params.id;
  const users = await prisma.connection.findMany({
    where: {
      OR: [
        {
          AND: [
            { OR: [{ user1Id: userId }, { user2Id: userId }] },
            { status: 'ACCEPTED' }
          ]
        },
        {
          AND: [
            { user2Id: userId },
            { status: 'PENDING' }
          ]
        }
      ]
    },
    include: {
      user1: true,
      user2: true,
    },
  });

  const connections = users.map(connection => {
    const connectedUser = connection.user1Id === userId ? connection.user2 : connection.user1;
    return {
      user: connectedUser,
      status: connection.status
    };
  });

  res.status(200).json({ success: true, connections });
});

const addConnection = expressAsyncHandler(async (req, res) => {
  const user1Id = req.params.id1;
  const user2Id = req.params.id2;

  const connection = await prisma.connection.create({
    data: {
      user1Id,
      user2Id,
      status: 'PENDING'
    },
    include: {
      user1: true,
      user2: true
    }
  });

  res.status(200).json({ success: true });
});

const removeConnection = expressAsyncHandler(async (req, res) => {
  const user1Id = req.params.id1;
  const user2Id = req.params.id2;

  await prisma.connection.deleteMany({
    where: {
      OR: [
        { AND: [{ user1Id }, { user2Id }] },
        { AND: [{ user1Id: user2Id }, { user2Id: user1Id }] }
      ]
    }
  });

  res.status(200).json({ success: true });
});

const acceptConnection = expressAsyncHandler(async (req, res) => {
  const user1Id = req.params.id1;
  const user2Id = req.params.id2;

  const connection = await prisma.connection.updateMany({
    where: {
      OR: [
        { AND: [{ user1Id }, { user2Id }, { status: 'PENDING' }] },
        { AND: [{ user1Id: user2Id }, { user2Id: user1Id }, { status: 'PENDING' }] }
      ]
    },
    data: {
      status: 'ACCEPTED'
    }
  });

  res.status(200).json({ success: true });
});

export {
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
  updateSkills
};

