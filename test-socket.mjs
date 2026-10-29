
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected successfully!");
  console.log("Socket ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Connection error:", error.message);
});
