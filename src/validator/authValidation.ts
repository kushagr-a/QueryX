import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: "Validation failed",
			errors: errors.array(),
		});
	}

	next();
};

export const registerValidation = [
	body("username")
		.trim()
		.isLength({ min: 3, max: 10 })
		.withMessage("Username must be between 3 and 10 characters"),
	body("email")
		.isEmail()
		.withMessage("Please provide a valid email address")
		.normalizeEmail(),
	body("password")
		.isString()
		.withMessage("Password must be a string")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long")
		.isAlphanumeric()
		.withMessage("Password must contain only letters and numbers"),
	validateRequest
];

export const loginValidation = [
	body("email")
		.isEmail()
		.withMessage("Please provide a valid email address")
		.normalizeEmail(),
	body("password")
		.isString()
		.withMessage("Password must be a string")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long")
		.isAlphanumeric()
		.withMessage("Password must contain only letters and numbers"),
	validateRequest
]

