import { betterAuth } from "better-auth";
import { emailOTP, admin } from "better-auth/plugins"

import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { resend } from "./resend";



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET
        }
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                const { data, error } = await resend.emails.send({
                    from: "GyanGanga <onboarding@resend.dev>",
                    to: [email],
                    subject: "Your verification code",
                    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                              <html xmlns="http://www.w3.org/1999/xhtml">
                                <head>
                                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                                    <title>Your GyanGanga OTP</title>
                                </head>
                                <body style="margin: 0; padding: 0;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                                        <tr>
                                            <td align="center" bgcolor="#f5f5f5" style="padding: 40px 0 30px 0;">
                                                <h1 style="font-family: Arial, sans-serif; color: #333333;">GyanGanga</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                                <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #555555;">Hello,</p>
                                                <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #555555;">Here is your One-Time Password (OTP) to securely log in to GyanGanga:</p>
                                                <div style="text-align: center; margin: 30px 0;">
                                                    <span style="display: inline-block; padding: 15px 25px; background-color: #007bff; color: #ffffff; font-size: 24px; font-weight: bold; border-radius: 5px; font-family: Arial, sans-serif; letter-spacing: 2px;">[ ${otp}]</span>
                                                </div>
                                                <p style="font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #888888;">This code is valid for 10 minutes. Please do not share this with anyone.</p>
                                                <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #555555;">If you didn't request this, please ignore this email.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#f5f5f5" style="padding: 30px 30px 30px 30px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td style="color: #999999; font-family: Arial, sans-serif; font-size: 12px;" width="75%">
                                                            &copy; 2025 GyanGanga. All Rights Reserved.<br/>
                                                            <a href="#" style="color: #007bff;">Resend OTP</a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </body>
                              </html>`,
                })
                if (error) console.log(error)
                console.log("Email sent: ", {
                    data, error
                })
            },
        }),
        admin()
    ]
});