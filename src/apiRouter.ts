import { Router } from "express";

import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chats.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/chats",chatRouter)

export default apiRouter;