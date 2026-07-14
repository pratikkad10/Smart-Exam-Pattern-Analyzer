import { transporter } from "../../config/email.js";

/**
 * Sends an email with a professional template.
 */
const sendEmail = async (to, subject, htmlContent) => {
    try {
        const info = await transporter.sendMail({
            from: `"Smart Exam Pattern Analyzer" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html: htmlContent,
        });
        console.log(`Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

export const sendVerificationEmail = async (firstName, email, emailLink) => {
    const subject = "Verify your email - Smart Exam Pattern Analyzer";
    const html = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">Smart Exam Pattern Analyzer</h1>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <h2 style="color: #111827; margin-top: 0;">Welcome, ${firstName}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
                Thank you for signing up. To complete your registration and unlock AI-powered exam insights, please verify your email address.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${emailLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${emailLink}" style="color: #4f46e5; word-break: break-all;">${emailLink}</a>
            </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} Smart Exam Pattern Analyzer. All rights reserved.</p>
        </div>
    </div>
    `;
    return sendEmail(email, subject, html);
};

export const sendPasswordResetEmail = async (firstName, email, emailLink) => {
    const subject = "Reset your password - Smart Exam Pattern Analyzer";
    const html = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">Smart Exam Pattern Analyzer</h1>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <h2 style="color: #111827; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
                Hi ${firstName},<br><br>
                We received a request to reset your password. Click the button below to choose a new one. This link will expire in 2 hours.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${emailLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Reset Password</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${emailLink}" style="color: #4f46e5; word-break: break-all;">${emailLink}</a>
            </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            <p>&copy; ${new Date().getFullYear()} Smart Exam Pattern Analyzer. All rights reserved.</p>
        </div>
    </div>
    `;
    return sendEmail(email, subject, html);
};
