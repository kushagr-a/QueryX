import { Router } from "express";
import { deleteChat, generateMessage, getChats, getMessagesByChatId } from "../controller/chats.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const chatRouter = Router();

chatRouter.route("/message").post(isAuthenticated, generateMessage);
chatRouter.route("/chats").get(isAuthenticated, getChats);
chatRouter.route("/messages").get(isAuthenticated, getMessagesByChatId);
chatRouter.route("/deleteChat").delete(isAuthenticated, deleteChat);

export default chatRouter;