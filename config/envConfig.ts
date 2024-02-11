import * as dotenv from "dotenv";
import path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export type ConfigProps = {
  MONGO_NAME: string;
  MONGO_PROFILE: string;
  MONGO_REGION: string;
  MONGO_PROJECT: string;
  MONGO_ORG: string;
};

export const getConfig = (): ConfigProps => ({
  MONGO_NAME: process.env.MONGO_NAME || "",
  MONGO_PROFILE: process.env.MONGO_PROFILE || "",
  MONGO_REGION: process.env.MONGO_REGION || "",
  MONGO_PROJECT: process.env.MONGO_PROJECT || "",
  MONGO_ORG: process.env.MONGO_ORG || "",
});
