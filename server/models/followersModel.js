import mongoose, { Schema } from "mongoose";

const followerSchema = new mongoose.Schema(
  {
    followerId: { type: Schema.Types.ObjectId, ref: "User" },
    writerId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Followers = mongoose.model("Follower", followerSchema);

export default Followers;
