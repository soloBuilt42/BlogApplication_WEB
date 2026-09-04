import express from "express";
import { googleSignup, login, register } from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/google-signup", googleSignup);
router.post("/login", login);

export default router;
