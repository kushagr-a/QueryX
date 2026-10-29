import cookieParser from "cookie-parser";
import express from "express";
import apiRouter from "./apiRouter.js";
import morgan from "morgan";
import cors from "cors";

import { config } from "./config/config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(config.cors));

app.use("/api", apiRouter);

app.get("/healthz", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
    Environment: config.environment,
  });
});

export default app;