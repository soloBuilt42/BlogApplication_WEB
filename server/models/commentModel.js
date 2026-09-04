import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    desc: { type: String, required: [true, "Comment is required"] },
  },
  { timestamps: true }
);

const Comments = mongoose.model("Comment", commentSchema);

export default Comments;
