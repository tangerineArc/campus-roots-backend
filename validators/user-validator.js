"use strict";

import { PrismaClient } from "@prisma/client";
import { body } from "express-validator";

const prisma = new PrismaClient();

const validateUser = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage(
      "Username must be at least 3 characters and at most 100 characters long"
    )
    .custom(async (username) => {
      const count = await prisma.user.count({
        where: { username: username.toLowerCase() },
      });

      if (count) {
        throw new Error("Provided username has already been taken");
      }
      return true;
    }),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

export default validateUser;
