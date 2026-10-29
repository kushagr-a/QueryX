import nodemailer from "nodemailer";

import { config } from "../config/config.js";

export const transporter = nodemailer.createTransport(
    {
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: config.google.user,
            clientId: config.google.clientId,
            clientSecret: config.google.clientSecret,
            refreshToken: config.google.refreshToken,
        }
    }
)

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error("Error connecting to the email server:", error);
    } else {
        console.log("Email server connection successful.");
    }
})

// Function to send email
export const sendEmail = async (
    to: string,
    subject: string,
    html: string,
    text: string
) => {
    const mailOptions = {
        from: `"Perplexity" <${config.google.user}>`,
        to,
        subject,
        text,
        html
    }
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}