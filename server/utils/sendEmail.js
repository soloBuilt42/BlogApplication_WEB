import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Verification from "../models/emailVerificationModel.js";
import { generateOTP, hashString } from "./index.js";

dotenv.config();

const { AUTH_EMAIL, AUTH_PASSWORD, MAIL_HOST, MAIL_PORT } = process.env;

const isMailConfigured = Boolean(AUTH_EMAIL && AUTH_PASSWORD);

const transporter = isMailConfigured
  ? nodemailer.createTransport({
      host: MAIL_HOST || "smtp.gmail.com",
      port: Number(MAIL_PORT) || 587,
      secure: Number(MAIL_PORT) === 465,
      auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASSWORD,
      },
    })
  : null;

const buildTemplate = (name, otp) => `
  <div style="font-family:Arial, sans-serif; font-size:18px; color:#333">
    <h3 style="color:rgb(8,56,188)">Please verify your email address</h3>
    <hr />
    <h4>Hi, ${name}</h4>
    <p>Use the one time password below to verify your email address.</p>
    <h1 style="font-size:28px; letter-spacing:6px; color:rgb(8,56,188)">${otp}</h1>
    <p>This OTP <b>expires in 10 minutes</b>.</p>
    <div>
      <h5 style="margin-bottom:0">Regards</h5>
      <h4 style="margin-top:4px">Blog Wave</h4>
    </div>
  </div>
`;

export const sendVerificationEmail = async (user, res, token) => {
  const { _id, email, name } = user;
  const otp = generateOTP();

  try {
    const hashedOtp = await hashString(otp);

    await Verification.findOneAndDelete({ userId: _id });
    await Verification.create({
      userId: _id,
      token: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    if (!isMailConfigured) {
      // No SMTP credentials configured - surface the OTP in the server log so the
      // verification flow still works locally.
      console.log(
        `[sendEmail] AUTH_EMAIL/AUTH_PASSWORD not set. OTP for ${email}: ${otp}`
      );

      return res.status(201).json({
        success: "PENDING",
        message:
          "An OTP has been generated. Email delivery is not configured, check the server console for the code.",
        user: { _id, email, name },
        token,
      });
    }

    await transporter.sendMail({
      from: AUTH_EMAIL,
      to: email,
      subject: "Email Verification",
      html: buildTemplate(name, otp),
    });

    return res.status(201).json({
      success: "PENDING",
      message: "An OTP has been sent to your email address. Please verify it.",
      user: { _id, email, name },
      token,
    });
  } catch (error) {
    console.log("[sendEmail] Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send the verification email" });
  }
};

export default sendVerificationEmail;
