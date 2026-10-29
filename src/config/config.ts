import dotenv from "dotenv"
dotenv.config()

if (!process.env.DB_URL) {
    throw new Error("CRITICAL ERROR: MONGO_URI is not defined in the environment variables!")
}

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(/\s*(?:\|\||,)\s*/)
    .filter(Boolean)

export const config = {
    port: Number(process.env.PORT || 3000),
    environment: process.env.NODE_ENV || "development",
    mongo: {
        uri: String(process.env.DB_URL),

        // Production-ready tuning options
        options: {
            maxPoolSize: 10,             // Maintain up to 10 socket connections concurrently
            minPoolSize: 2,              // Maintain at least 2 socket connections
            socketTimeoutMS: 45000,      // Close sockets after 45 seconds of inactivity
            serverSelectionTimeoutMS: 5000, // Fail fast (5s) if MongoDB goes down instead of hanging
            family: 4                    // Force IPv4 to avoid DNS resolution delays
        }
    },
    cors: {
        origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]

    },
    google:{
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN || "",
        user: process.env.GOOGLE_USER || ""
    },
    jwt: {
        secretKey: process.env.JWT_SECRET_KEY as string,
        expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    },
    ai: {
        apiKey: process.env.GOOGLE_API_KEY as string,
        mistralApiKey: process.env.MISTRAL_API_KEY as string
    },
    internetSearch: {
        tavilyApiKey: process.env.TAVILY_API_KEY as string
    }
}