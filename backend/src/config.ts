import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV != "production" ? ".env" : ".env.production",
});

const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
};

export { CONFIG };
export default CONFIG;
