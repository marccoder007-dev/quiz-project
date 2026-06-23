import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Conncected to database!!!");
  } catch (error) {
    console.log(`Could not connect to database: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
