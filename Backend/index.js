import cors from "cors";

const app = express();

const allowedOrigins = [
  "https://fund-goal-dot-fun-frontend.vercel.app",
  "https://fundgoal.fun",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));