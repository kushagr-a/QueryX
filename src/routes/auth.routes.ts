import { Router } from "express";
import { getMe, login, register, verifyEmail } from "../controller/auth.controller.js";
import { registerValidation, loginValidation } from "../validator/authValidation.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * @route   POST api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body { username, email, password }
 */
authRouter.route("/register").post(registerValidation, register);
/**
 * @route   GET api/auth/verifyEmail
 * @desc    Verify user email
 * @access  Public
 * @query { token }
 */
authRouter.route("/verifyEmail").get(verifyEmail);


/*
create api to resend verification email
kisi krn use usko email recive nhi hua hoga to wo uapas se email send kr ske apne email address pe and wo verify krwa ske apne email address ko
*/
// authRouter.route("/resendVerificationEmail").get();

/**
 * @route   POST api/auth/login
 * @desc    Login a user
 * @access  Public
 * @body { email, password }
 */
authRouter.route("/login").post(loginValidation, login);

/**
 * @route   GET api/auth/getMe
 * @desc    Get the current user's information
 * @access  Private
 */
authRouter.route("/getMe").get(isAuthenticated, getMe)


/**
 * task 2 ;- agr use already apne email ko verify kr chuka hoga to usko different page dikhna chahiye jb wo uapas se us link ko click krega
 */


export default authRouter;