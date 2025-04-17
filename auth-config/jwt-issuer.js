"use strict";

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import jsonwebtoken from "jsonwebtoken";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PRIVATE_KEY = readFileSync(
  join(__dirname, "keys", "private-key.pem"),
  "utf8"
);

export default function issueJwt(user) {
  const payload = {
    sub: user.id,
    iat: Math.floor(Date.now() / 1000), // seconds
  };

  const signedToken = jsonwebtoken.sign(payload, PRIVATE_KEY, {
    expiresIn: "1d",
    algorithm: "RS256",
  });

  return { token: signedToken, expiresIn: "1d" };
}
