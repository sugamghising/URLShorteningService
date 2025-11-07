import mongoose from "mongoose";
import { env } from "./env";

export const connectDb = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.log("❌ Failed to connect to MONGODB", error);
        process.exit(1);
    }
}

