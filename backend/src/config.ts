import dotenv from "dotenv";

dotenv.config({
  path: ".env-server",
});

const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
};

export { CONFIG };
export default CONFIG;
