import mongoose from "mongoose";

import { config } from "../config/config.js";

export const connectDB = async () => {
    try {
        // Gracefully handle initial connection
        const connection = await mongoose.connect(config.mongo.uri, config.mongo.options)
        console.log(`MongoDB Connected: ${connection.connection.host}`)
    } catch (error: any) {
        console.error(` Initial MongoDB Connection Error: ${error.message}`)
        process.exit(1); // Exit process with failure in production
    }
}

// Monitor ongoing connection events
mongoose.connection.on('error', (err) => {
    console.log(`MongoDB Runtime Error: ${err}`)
})

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected! Attempting to reconnect...')
})

// Handle application termination gracefully
export const closeDB = async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination.")
}