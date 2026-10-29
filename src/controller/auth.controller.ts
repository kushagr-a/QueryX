import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { userModel } from "../models/auth.model.js";
import { sendEmail } from "../services/mail.service.js";
import { config } from "../config/config.js";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const isUserAlreadyExist = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserAlreadyExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists with the provided username or email",
                err: "User already exists"
            });
        }

        // user creation
        const user = await userModel.create({
            username,
            email,
            pass: password
        });

        // 
        const emailVerificationToken = jwt.sign(
            {
                email: user.email,
            },
            config.jwt.secretKey,
            {
                expiresIn: config.jwt.expiresIn as any
            }
        );

        // Send a welcome email to the user
        await sendEmail(
            user.email,
            "Welcome to Our Platform!",
            `<p>Hi ${user.username},</p>
             <p>Thank you for registering on our platform. We're excited to have you on board!</p>
             <p>Please verify your email address by clicking on the link below:</p>
             <a href="http://localhost:3000/api/auth/verifyEmail?token=${emailVerificationToken}">Verify Email</a>
             <p>Best regards,<br/>The Team</p>`,
            `Hi ${user.username},

Thank you for registering on our platform. We're excited to have you on board!

Best regards,
The Team`
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                username: user.username,
                email: user.email
            }
        })


    } catch (error: any) {
        console.error("Error in User register controller");

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Email verification token is required",
                err: "Token is required"
            });
        }

        const decodedToken = jwt.verify(token as string, config.jwt.secretKey) as jwt.JwtPayload;

        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid verification token",
                err: "Invalid token"
            });
        }

        console.log(decodedToken);

        const user = await userModel.findOne({ email: decodedToken.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                err: "User not found"
            });
        }

        // user.verified = true;
        await userModel.updateOne({ email: user.email }, {
            $set: { verified: true }
        });

        res.send(`
            <h1>Email Verified Successfully!</h1>
            <p>Your email has been verified successfully. You can now login to your account.</p>
        `);

    } catch (error: any) {
        console.error("Error in verifyEmail controller");

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+pass");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                err: "User not found"
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if(!isPasswordValid){
            return res.status(401).json({
                success: false,
                message: "Invalid password",
                err: "Invalid password"
            });
        }

        if(!user.verified){
            return res.status(401).json({
                success: false,
                message: "Account is not verified",
                err: "Account not verified"
            });
        }

        // token create
        const token = jwt.sign(
            {
                _id: user._id,
                id: user._id,
                username: user.username,
            },
            config.jwt.secretKey,
            {
                expiresIn: config.jwt.expiresIn as any
            }
        );

        // cookie store
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                accessToken: token
            }
        });
    } catch (error: any) {
        console.error("Error in login controller", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const user = await userModel.findById(userId).select("-pass");
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
        

    } catch (error: any) {
        console.error("Error in getMe controller", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}