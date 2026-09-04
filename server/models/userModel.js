import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    accountType: {
      type: String,
      enum: ["User", "Writer"],
      default: "User",
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    provider: {
      type: String,
      default: "Codewave",
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "Follower" }],
  },
  { timestamps: true }
);

const Users = mongoose.model("User", userSchema);

export default Users;
