import dotenv from "dotenv";

dotenv.config({
  path: "solana.env",
});

const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
  SOLANA_NETWORK: process.env.SOLANA_NETWORK || "devnet",
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
};

export { CONFIG };
export default CONFIG;
