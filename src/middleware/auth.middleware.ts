import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

import { config } from "../config/config.js";


export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies?.Token || req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                err: "Token not found"
            });
        }

        const decodedToken = jwt.verify(token, config.jwt.secretKey);

        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                err: "Invalid token"
            });
        }

        (req as any).user = decodedToken as jwt.JwtPayload;

        next();
    } catch (error: any) {
        console.error("Error in isAuthenticated middleware", error.message);

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
            })
        }

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Token Expired",
            })
        }

        return res.status(500).json({
            success: false,
            message: "Authentication failed",
        });
    }
}