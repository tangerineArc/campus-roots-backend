"use strict";

import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";

import issueJwt from "../auth-config/jwt-issuer.js";
import validateUser from "../validators/user-validator.js";

const prisma = new PrismaClient();

const sendAuthStatus = (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, user });
};

const signInUser = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, errors: ["Incorrect username or password"] });
  }

  const match = await compare(password, user.passwordHash);
  if (!match) {
    return res
      .status(400)
      .json({ success: false, errors: ["Incorrect username or password"] });
  }

  const { token, expiresIn } = issueJwt(user);

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .status(200)
    .json({ success: true, user, expiresIn });
});

const signOutUser = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logged out user" });
};

const signUpUser = [
  validateUser,
  expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array().map((err) => err.msg) });
    }

    const { username, password } = req.body;
    const passwordHash = await hash(password, 10);

    const user = await prisma.user.create({ data: { username, passwordHash } });

    const { token, expiresIn } = issueJwt(user);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(201)
      .json({ success: true, user, expiresIn });
  }),
];

export { sendAuthStatus, signInUser, signOutUser, signUpUser };
