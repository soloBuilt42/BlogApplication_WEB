import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: [true, "Title is required"] },
    slug: { type: String, unique: true },
    desc: { type: String, required: [true, "Description is required"] },
    img: { type: String },
    cat: { type: String },
    views: [{ type: Schema.Types.ObjectId, ref: "View" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Posts = mongoose.model("Post", postSchema);

export default Posts;
