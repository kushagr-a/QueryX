import bcrypt from "bcryptjs";
import { Schema, model, Model } from "mongoose";

export interface IUser {
	username: string;
	email: string;
	pass: string;
	verified: boolean;
}

export interface IUserMethods {
	comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
			maxlength: 50,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},

		pass: {
			type: String,
			required: true,
			minlength: 8,
			select: false,
		},

		verified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function () {
	if (!this.isModified("pass")) return;

	this.pass = await bcrypt.hash(this.pass, 12);
});

userSchema.methods.comparePassword = function (candidatePassword: string) {
	return bcrypt.compare(candidatePassword, this.pass);
};

export const userModel = model<IUser, UserModel>("User", userSchema);