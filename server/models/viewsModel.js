import mongoose, { Schema } from "mongoose";

const viewSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

const Views = mongoose.model("View", viewSchema);

export default Views;
