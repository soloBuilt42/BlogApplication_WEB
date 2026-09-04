import mongoose from "mongoose";
import Posts from "../models/postModel.js";
import Users from "../models/userModel.js";
import Comments from "../models/commentModel.js";
import Followers from "../models/followersModel.js";
import Views from "../models/viewsModel.js";
import { createSlug } from "../utils/index.js";

const groupByDay = [
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      Total: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
];

export const stats = async (req, res, next) => {
  try {
    const { query } = req.body;
    const { userId } = req.body.user;

    const numOfDays = Number(query) || 28;
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - numOfDays);

    const totalPosts = await Posts.find({ user: userId }).countDocuments();

    const totalViews = await Views.find({ user: userId }).countDocuments();

    const totalWriters = await Users.find({
      accountType: "Writer",
    }).countDocuments();

    const viewStats = await Views.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate, $lte: currentDate },
        },
      },
      ...groupByDay,
    ]);

    const followersStats = await Followers.aggregate([
      {
        $match: {
          writerId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate, $lte: currentDate },
        },
      },
      ...groupByDay,
    ]);

    const totalFollowers = await Users.findById(userId);

    const last5Followers = await Users.findById(userId).populate({
      path: "followers",
      options: { sort: { _id: -1 }, limit: 5 },
      populate: {
        path: "followerId",
        select: "name email image accountType followers",
      },
    });

    const last5Posts = await Posts.find({ user: userId })
      .limit(5)
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      message: "Data loaded successfully",
      totalPosts,
      totalViews,
      totalWriters,
      followers: totalFollowers?.followers?.length || 0,
      viewStats,
      followersStats,
      last5Followers: last5Followers?.followers,
      last5Posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const result = await Users.findById(userId).populate({
      path: "followers",
      options: { sort: { _id: -1 }, limit, skip },
      populate: {
        path: "followerId",
        select: "name email image accountType followers",
      },
    });

    const totalFollowers = await Users.findById(userId);
    const total = totalFollowers?.followers?.length || 0;
    const numOfPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: result?.followers,
      total,
      numOfPages,
      page,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostContent = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const total = await Posts.countDocuments({ user: userId });
    const numOfPages = Math.ceil(total / limit);

    const posts = await Posts.find({ user: userId })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Content loaded successfully",
      data: posts,
      total,
      numOfPages,
      page,
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { desc, img, title, cat } = req.body;

    if (!desc || !img || !title || !cat) {
      return next("Please provide all the required fields");
    }

    const post = await Posts.create({
      user: userId,
      desc,
      img,
      title,
      slug: req.body.slug || createSlug(title),
      cat,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const commentPost = async (req, res, next) => {
  try {
    const { desc } = req.body;
    const { userId } = req.body.user;
    const { id } = req.params;

    if (!desc?.trim()) {
      return next("Comment is required");
    }

    const post = await Posts.findById(id);

    if (!post) {
      return next("Post not found");
    }

    const newComment = await Comments.create({
      desc: desc.trim(),
      user: userId,
      post: id,
    });

    await Posts.findByIdAndUpdate(id, { $push: { comments: newComment._id } });

    const populated = await newComment.populate({
      path: "user",
      select: "name image",
    });

    res.status(201).json({
      success: true,
      message: "Comment published successfully",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const { title, desc, img, cat, status } = req.body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (desc !== undefined) update.desc = desc;
    if (img !== undefined) update.img = img;
    if (cat !== undefined) update.cat = cat;
    if (status !== undefined) update.status = status;

    const post = await Posts.findOneAndUpdate(
      { _id: id, user: userId },
      update,
      { new: true }
    );

    if (!post) {
      return next("Post not found");
    }

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const { cat, writerId, search } = req.query;

    const query = { status: true };

    if (cat) query.cat = cat;
    if (writerId) query.user = writerId;
    if (search) query.title = { $regex: search, $options: "i" };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Posts.countDocuments(query);
    const numOfPages = Math.ceil(total / limit);

    const posts = await Posts.find(query)
      .populate({ path: "user", select: "name image" })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Posts loaded successfully",
      data: posts,
      page,
      numOfPages,
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const getPopularContents = async (req, res, next) => {
  try {
    const posts = await Posts.aggregate([
      { $match: { status: true } },
      {
        $project: {
          title: 1,
          slug: 1,
          img: 1,
          cat: 1,
          user: 1,
          createdAt: 1,
          views: { $size: "$views" },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          slug: 1,
          img: 1,
          cat: 1,
          views: 1,
          createdAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.image": 1,
        },
      },
    ]);

    const writers = await Users.aggregate([
      { $match: { accountType: "Writer" } },
      {
        $project: {
          name: 1,
          image: 1,
          followers: { $size: "$followers" },
        },
      },
      { $sort: { followers: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      message: "Successful",
      data: { posts, writers },
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Posts.findById(postId).populate({
      path: "user",
      select: "name image",
    });

    if (!post) {
      return next("Post not found");
    }

    const newView = await Views.create({
      user: post?.user?._id,
      post: postId,
    });

    await Posts.findByIdAndUpdate(postId, { $push: { views: newView._id } });

    res.status(200).json({
      success: true,
      message: "Post loaded successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const postComments = await Comments.find({ post: postId })
      .populate({ path: "user", select: "name image" })
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      message: "Comments loaded successfully",
      data: postComments,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;

    const post = await Posts.findOneAndDelete({ _id: id, user: userId });

    if (!post) {
      return next("Post not found");
    }

    await Comments.deleteMany({ post: id });
    await Views.deleteMany({ post: id });

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id, postId } = req.params;

    const comment = await Comments.findOneAndDelete({
      _id: id,
      post: postId,
      user: userId,
    });

    if (!comment) {
      return next("Comment not found");
    }

    await Posts.updateOne({ _id: postId }, { $pull: { comments: id } });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
