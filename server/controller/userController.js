import Verification from "../models/emailVerificationModel.js";
import Followers from "../models/followersModel.js";
import Users from "../models/userModel.js";
import { compareString, createJWT } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const otpVerification = async (req, res, next) => {
  try {
    const { userId, otp } = req.params;

    const result = await Verification.findOne({ userId });

    if (!result) {
      return next("Invalid verification link. Please request a new OTP.");
    }

    const { expiresAt, token } = result;

    if (expiresAt < Date.now()) {
      await Verification.findOneAndDelete({ userId });

      return next("Verification token has expired. Please request a new one.");
    }

    const isMatch = await compareString(otp, token);

    if (!isMatch) {
      return next("Verification failed. Please check the OTP and try again.");
    }

    const [user] = await Promise.all([
      Users.findByIdAndUpdate(userId, { emailVerified: true }, { new: true }),
      Verification.findOneAndDelete({ userId }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user,
      token: createJWT(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const resendOTP = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await Users.findById(id);

    if (!user) {
      return next("User not found");
    }

    if (user.emailVerified) {
      return next("This email address is already verified");
    }

    await Verification.findOneAndDelete({ userId: id });

    const token = createJWT(user._id);

    return sendVerificationEmail(user, res, token);
  } catch (error) {
    next(error);
  }
};

export const followWriter = async (req, res, next) => {
  try {
    const { userId: followerId } = req.body.user;
    const { id } = req.params;

    if (String(followerId) === String(id)) {
      return next("You cannot follow yourself");
    }

    const writer = await Users.findById(id);

    if (!writer) {
      return next("Writer not found");
    }

    const existing = await Followers.findOne({ followerId, writerId: id });

    if (existing) {
      await Followers.findByIdAndDelete(existing._id);
      await Users.findByIdAndUpdate(id, { $pull: { followers: existing._id } });

      return res.status(200).json({
        success: true,
        following: false,
        message: `You unfollowed ${writer.name}`,
      });
    }

    const newFollower = await Followers.create({ followerId, writerId: id });

    await Users.findByIdAndUpdate(id, { $push: { followers: newFollower._id } });

    return res.status(201).json({
      success: true,
      following: true,
      message: `You are now following ${writer.name}`,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { firstName, lastName, image } = req.body;

    if (!firstName || !lastName) {
      return next("Please provide all the required fields");
    }

    const update = { name: `${firstName} ${lastName}` };
    if (image) update.image = image;

    const user = await Users.findByIdAndUpdate(userId, update, { new: true });

    if (!user) {
      return next("User not found");
    }

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
      token: createJWT(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const getWriter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await Users.findById(id).populate({
      path: "followers",
      select: "followerId",
    });

    if (!user) {
      return next("Writer not found");
    }

    user.password = undefined;

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
