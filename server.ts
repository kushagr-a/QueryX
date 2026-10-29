import http from "http";

import "dotenv/config";
import app from "./src/app.js";
import { config } from "./src/config/config.js"
import { closeDB, connectDB } from "./src/db/database.js";
import { initSocket } from "./src/sockets/server.socket.js";

const port = config.port

// http server
const httpServer = http.createServer(app);

// Establish production DB pool
connectDB();

// Initialize Socket.IO
initSocket(httpServer);

const server = httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful Shutdown listeners
const handleShutdown = async (signal: any) => {
  console.log(`\nRecived ${signal}. Starting graceFul shutdown...`)
  server.close(async () => {
    console.log("HTTP server closed.")
    await closeDB();
    process.exit(0);
  })
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));