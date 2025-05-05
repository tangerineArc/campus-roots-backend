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
            startDate: new Date(startDate),
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

export {
  getProfileData,
  getUserConversations,
  getUserMessagesWithOtherUser,
  updateAchievements,
  updateEducation,
  updateExperiences,
  updateProfileData,
  updateSkills,
};
