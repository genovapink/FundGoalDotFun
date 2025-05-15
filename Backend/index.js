// index.js
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "https://fundgoal.fun",
    "https://fund-goal-dot-fun-frontend.vercel.app"
  ],
  credentials: true,
}));

app.get("/api/tokens", (req, res) => {
  res.json({ tokens: [] });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
