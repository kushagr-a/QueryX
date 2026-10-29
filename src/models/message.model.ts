import { Schema, model, Types } from "mongoose";

export type MessageRole = "user" | "ai";

export interface IMessage {
	chat: Types.ObjectId;
	content: string;
	role: MessageRole;
}

const messageSchema = new Schema<IMessage>(
	{
		chat: {
			type: Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
			index: true,
		},

		content: {
			type: String,
			required: true,
			trim: true,
		},

		role: {
			type: String,
			enum: ["user", "ai"],
			required: true,
		},
	},
	{ timestamps: true }
);

messageSchema.index({ chat: 1, createdAt: 1 });

export const messageModel = model("Message", messageSchema);