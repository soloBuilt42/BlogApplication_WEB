import mongoose, { Schema } from "mongoose";

const emailVerificationSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  token: String,
  createdAt: Date,
  expiresAt: Date,
});

const Verification = mongoose.model("Verification", emailVerificationSchema);

export default Verification;
