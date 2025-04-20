"use strict";

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";
import { Strategy } from "passport-azure-ad-oauth2";

import decideUserRole from "../utils/user-role-decider.js";

const prisma = new PrismaClient();

const __dirname = dirname(fileURLToPath(import.meta.url));

const PRIVATE_KEY = readFileSync(
  join(__dirname, "keys", "private-key.pem"),
  "utf8"
);

async function verifyCallback(
  accessToken,
  refreshToken,
  params,
  profile,
  done
) {
  try {
    const res = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user info from Microsoft graph");
    }

    const userInfo = await res.json();
    
    if (!userInfo.mail.endsWith("@iitp.ac.in")) {
      return done(null, false, { message: "Not an IITP account" });
    }

    const user = await prisma.user.upsert({
      where: { email: userInfo.mail },
      update: {
        name: userInfo.displayName,
        role: decideUserRole(userInfo.mail),
      },
      create: {
        email: userInfo.mail,
        name: userInfo.displayName,
        role: decideUserRole(userInfo.mail),
      },
    });

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const token = jsonwebtoken.sign(jwtPayload, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "1d",
    });

    return done(null, { jwt: token });
  } catch (error) {
    return done(error);
  }
}

const oauthStrategy = new Strategy(
  {
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    callbackURL: process.env.AZURE_CALLBACK_URL,
    scope: ["user.read"],
    resource: "https://graph.microsoft.com",
  },
  verifyCallback
);

export default oauthStrategy;
