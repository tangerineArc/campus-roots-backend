"use strict";

import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import passport from "passport";

import jwtStrategy from "./auth-config/jwt-strategy.js";
import oauthStrategy from "./auth-config/oauth-strategy.js";

import authRouter from "./routes/auth-router.js";
import indexRouter from "./routes/index-router.js";
import fetchMessages from "./routes/messages.js";
import userRouter from "./routes/user-router.js";

const app = express();

const PORT = process.env.PORT || 3000;

/* handle cross-origin requests */
app.use(
  cors({
    origin: JSON.parse(process.env.ALLOWED_ORIGINS),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.options("*", cors());

/* cookie parsing middleware */
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded());

/* set up passport */
passport.use("azure_oauth", oauthStrategy);
passport.use("jwt", jwtStrategy);

/* routes */
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", fetchMessages);
app.use("/user", userRouter);

/* non-existent routes handler */
app.all("*", (req, res) => {
  res.status(404).json({ success: false, errors: ["Resource not found"] });
});

/* error-handling middleware */
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send(err.message);
});

/* startup */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ...`);
});
