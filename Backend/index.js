import cors from "cors";
import express from "express";

const app = express();

const allowedOrigins = [
  "https://fundgoal.fun",
  "fundgoal-backend.replit.app",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
