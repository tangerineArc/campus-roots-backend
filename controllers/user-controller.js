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
  const userId = req.params.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      Experiences: true,
      Education: true,
      Skills: true,
      Achievements: true,
    },
  });

  res.status(200).json({ success: true, data: user });
});

const updateProfileData = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, About, Avatar } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name, About, Avatar },
  });

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

const updateExperience = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { Experiences } = req.body;

  await prisma.experience.deleteMany({ where: { userId: userId } });

  await Promise.all(
    Experiences.map((exp) =>
      prisma.experience.create({
        data: {
          company: exp.company,
          Role: exp.Role,
          StartDate: new Date(exp.StartDate),
          EndDate: exp.EndDate ? new Date(exp.EndDate) : null,
          isPresent: exp.isPresent,
          userId: userId,
        },
      })
    )
  );

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { Experiences: true },
  });

  res.status(200).json({ success: true, data: updatedUser });
});

const deleteExperience = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { Experiences } = req.body;
  await prisma.experience.deleteMany({
    where: { userId: userId },
  });

  await Promise.all(
    Experiences.map((exp) =>
      prisma.experience.create({
        data: {
          company: exp.company,
          Role: exp.Role,
          StartDate: new Date(exp.StartDate),
          EndDate: exp.EndDate ? new Date(exp.EndDate) : null,
          isPresent: exp.isPresent,
          userId: userId,
        },
      })
    )
  );

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { Experiences: true },
  });

  res.status(200).json({ success: true, data: updatedUser });
});

const updateEducation = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { Education } = req.body;

  await prisma.education.deleteMany({ where: { userId: userId } });

  const updatedEducation = await Promise.all(
    Education.map((edu) =>
      prisma.education.create({
        data: {
          Institution: edu.Institution,
          Degree: edu.Degree,
          StartDate: new Date(edu.StartDate),
          EndDate: edu.EndDate ? new Date(edu.EndDate) : null,
          isPresent: edu.isPresent,
          userId: userId,
        },
      })
    )
  );

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { Education: true },
  });

  res.status(200).json({ success: true, data: updatedUser });
});

const deleteEducation = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { Education } = req.body;

  await prisma.education.deleteMany({ where: { userId: userId } });

  await Promise.all(
    Education.map((edu) =>
      prisma.education.create({
        data: {
          Institution: edu.Institution,
          Degree: edu.Degree,
          StartDate: new Date(edu.StartDate),
          EndDate: edu.EndDate ? new Date(edu.EndDate) : null,
          isPresent: edu.isPresent,
          userId: userId,
        },
      })
    )
  );

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { Education: true },
  });

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

const updateSkill = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { Skills } = req.body;

  await prisma.skill.deleteMany({ where: { userId: userId } });

  await Promise.all(
    Skills.map((skill) =>
      prisma.skill.create({
        data: { SkillName: skill.SkillName, userId },
      })
    )
  );

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { Skills: true },
  });

  res.status(200).json({ success: true, data: updatedUser });
});

const deleteSkill = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { Skills } = req.body;

  await prisma.skill.deleteMany({ where: { userId: userId } });

  await Promise.all(
    Skills.map((skill) =>
      prisma.skill.create({
        data: { SkillName: skill.SkillName, userId },
      })
    )
  );

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { Skills: true },
  });

  res.status(200).json({ success: true, data: updatedUser });
});

const updateAchievements = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { Achievements } = req.body;

  await prisma.achievement.deleteMany({
    where: { userId: userId },
  });

  await Promise.all(
    Achievements.map((achievement) =>
      prisma.achievement.create({
        data: {
          Title: achievement.Title,
          Description: achievement.Description,
          Date: new Date(achievement.Date),
          userId: userId,
        },
      })
    )
  );

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { Achievements: true },
  });

  res.status(200).json({ success: true, data: updatedUser });
});

const deleteAchievements = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { Achievements } = req.body;

  await prisma.achievement.deleteMany({ where: { userId: userId } });

  await Promise.all(
    Achievements.map((achievement) =>
      prisma.achievement.create({
        data: {
          Title: achievement.Title,
          Description: achievement.Description,
          Date: new Date(achievement.Date),
          userId: userId,
        },
      })
    )
  );

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { Achievements: true },
  });

  res.status(200).json({ success: true, data: updatedUser });
});

export {
  deleteAchievements,
  deleteEducation,
  deleteExperience,
  deleteSkill,
  getProfileData,
  getUserConversations,
  getUserMessagesWithOtherUser,
  updateAchievements,
  updateEducation,
  updateExperience,
  updateProfileData,
  updateSkill,
};
