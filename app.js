"use strict";

import http from "node:http";

import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import passport from "passport";
import { Server as SocketIOServer } from "socket.io";

import configureChatSocket from "./services/chat-socket.js";

import jwtStrategy from "./auth-config/jwt-strategy.js";
import oauthStrategy from "./auth-config/oauth-strategy.js";

import authRouter from "./routes/auth-router.js";
import userRouter from "./routes/user-router.js";
import postsRouter from "./routes/posts-router.js";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

/* set up socket io */
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

configureChatSocket(io);

/* handle cross-origin requests */
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.options("*", cors());

/* cookie parsing middleware */
app.use(cookieParser());

/* body parsing middlewares */
app.use(express.json()); // parse json-data
app.use(express.urlencoded({ extended: true })); // parse form-data

/* set up passport */
passport.use("azure_oauth", oauthStrategy);
passport.use("jwt", jwtStrategy);

/* routes */
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/posts", postsRouter);

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
server.listen(PORT, () => {
  console.log(`Server + Websocket listening on port ${PORT} ...`);
});
