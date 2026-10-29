import { Schema, model, Types } from "mongoose";

export interface IChat {
	user: Types.ObjectId;
	title: string;
}

const chatSchema = new Schema<IChat>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},

		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
	},
	{ timestamps: true }
);

chatSchema.index({ user: 1, updatedAt: -1 });

export const chatModel = model("Chat", chatSchema);