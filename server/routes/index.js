import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoute.js";
import postRoutes from "./postRoute.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Blog Wave API is running" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);

export default router;
