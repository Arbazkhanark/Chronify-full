import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || "3000",
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_fNOyGEBx48Qd@ep-red-shape-aillwbpp.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  NODE_ENV: process.env.NODE_ENV || "development",
};













