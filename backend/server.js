import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import { cleanupExpiredTokens } from "./utils/tokenBlacklist.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100
});
app.use(limiter);

connectDB();

app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

app.get("/", (_, res) => res.json({ ok: true, time: new Date() }));

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
});
const onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendNotification", ({ toUserId, payload }) => {
    const socketId = onlineUsers.get(toUserId);
    if (socketId) io.to(socketId).emit("notification", payload);
  });

  socket.on("disconnect", () => {
    for (const [userId, sid] of onlineUsers.entries()) {
      if (sid === socket.id) onlineUsers.delete(userId);
    }
    console.log("Socket disconnected:", socket.id);
  });
});

const cleanupInterval = parseInt(process.env.TOKEN_BLACKLIST_CLEANUP_INTERVAL_MS || "60000", 10);
const cleaner = setInterval(cleanupExpiredTokens, cleanupInterval);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", () => {
  clearInterval(cleaner);
  server.close(() => process.exit(0));
});