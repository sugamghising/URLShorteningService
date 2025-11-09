import mongoose from "mongoose";
import { env } from "./env";

// Cache the connection to reuse across serverless invocations
let cachedConnection: typeof mongoose | null = null;

/**
 * Connects to MongoDB with connection caching for serverless environments
 * In serverless (Vercel), connections are reused across invocations when possible
 */
export const connectDb = async (): Promise<typeof mongoose> => {
    // Return cached connection if available and ready
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    // If connection exists but is not ready, wait for it
    if (cachedConnection && mongoose.connection.readyState !== 0) {
        await new Promise((resolve) => {
            mongoose.connection.once('connected', resolve);
            mongoose.connection.once('error', resolve);
        });
        if (mongoose.connection.readyState === 1) {
            return cachedConnection!;
        }
    }

    try {
        // Connect with serverless-optimized options
        const connection = await mongoose.connect(env.MONGODB_URI, {
            // Serverless-friendly connection options
            maxPoolSize: 1, // Limit connections per serverless function instance
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        
        cachedConnection = connection;
        console.log("✅ MongoDB Connected");
        return connection;
    } catch (error) {
        console.error("❌ Failed to connect to MONGODB", error);
        // Don't exit process in serverless - throw error instead
        // This allows the error handler middleware to return a proper response
        throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

