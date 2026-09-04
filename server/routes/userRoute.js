import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  followWriter,
  getWriter,
  otpVerification,
  resendOTP,
  updateUser,
} from "../controller/userController.js";

const router = express.Router();

router.post("/verify/:userId/:otp", otpVerification);
router.post("/resend-link/:id", resendOTP);
router.post("/follower/:id", userAuth, followWriter);
router.put("/update-user", userAuth, updateUser);
router.get("/get-user/:id", getWriter);

export default router;
