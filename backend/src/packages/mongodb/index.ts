import CONFIG from "@/config";
import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const mongoConnect = () => {
  console.log("Estabilished mongo");
  return mongoose.connect(CONFIG.MONGO_URI, {
    dbName: "fundfun",
  });
};

export { mongoConnect };
