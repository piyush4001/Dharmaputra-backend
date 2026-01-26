// Server entry point
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db";
import { env } from "./config/env";
import app from "./app";

const startServer = async () => {
  try {
    await connectDB();

   app.listen(Number(env.PORT), "0.0.0.0", () => {
  console.log("Server running on 0.0.0.0:5000");
});


  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
};

startServer();
