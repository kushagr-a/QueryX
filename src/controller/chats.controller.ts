import { Request, Response } from "express"

import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import { chatModel } from "../models/chat.model.js"
import { messageModel } from "../models/message.model.js"


export const generateMessage = async (req: Request, res: Response) => {
    try {
        const { message, chatId } = req.body;

        const userId = (req as any).user?._id
            || (req as any).user?.id
            || (req as any).user?.userId;

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        let title = null;
        let chat = null;

        // 1. Create a new chat only when chatId is not provided
        if (!chatId) {
            title = await generateChatTitle(message);

            chat = await chatModel.create({
                user: userId,
                title,
            });
        } else {
            // 2. Find existing chat belonging to this user
            chat = await chatModel.findOne({
                _id: chatId,
                user: userId,
            });

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found",
                });
            }
        }

        // 3. Use the same chat ID in both cases
        const activeChatId = chat._id;

        await messageModel.create({
            chat: activeChatId,
            content: message.trim(),
            role: "user",
        });

        // 4. Fetch complete conversation history
        const messages = await messageModel.find({
            chat: activeChatId,
        }).sort({ createdAt: 1 });

        // 5. Generate AI response
        const result = await generateResponse(messages);

        // 6. Save AI response
        const aiMessage = await messageModel.create({
            chat: activeChatId,
            content: result,
            role: "ai",
        });

        // 7. Return response
        return res.status(201).json({
            title,
            chat: chatId ? null : chat,
            aiMessage,
        });

    } catch (error: any) {
        console.error("Error in generating a message:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getChats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id
            || (req as any).user?.id
            || (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        const chats = await chatModel.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Chats fetched successfully",
            chats,
        });

    } catch (error: any) {
        console.error("Error in fetching chats:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getMessagesByChatId = async (req: Request, res: Response) => {
    try {
        const  chatId  = req.query.chatId as string;

        const userId = (req as any).user?._id
            || (req as any).user?.id
            || (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        const chat = await chatModel.findOne({ _id: chatId, user: userId });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            messages,
        });

    } catch (error: any) {
        console.error("Error in fetching messages by chat ID:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const deleteChat = async (req: Request, res: Response) => {
    try {
        const chatId = req.query.chatId as string;

        const userId = (req as any).user?._id
            || (req as any).user?.id
            || (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        const chat = await chatModel.findOneAndDelete({ _id: chatId, user: userId });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        // Optionally, delete all messages associated with this chat
        await messageModel.deleteMany({ chat: chatId });

        return res.status(200).json({
            success: true,
            message: "Chat and associated messages deleted successfully",
        });

    } catch (error: any) {
        console.error("Error in deleting chat:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};