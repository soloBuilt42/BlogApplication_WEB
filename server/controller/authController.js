import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

const normalizeAccountType = (value) =>
  String(value || "").toLowerCase() === "writer" ? "Writer" : "User";

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, accountType, image, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return next("Provide the required fields");
    }

    const type = normalizeAccountType(accountType);

    if (type === "Writer" && !image) {
      return next("Provide a profile picture");
    }

    const userExist = await Users.findOne({ email });

    if (userExist) {
      return next("Email address already exists. Try logging in instead.");
    }

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      image,
      accountType: type,
      provider: "Codewave",
    });

    user.password = undefined;
    const token = createJWT(user._id);

    if (type === "Writer") {
      return sendVerificationEmail(user, res, token);
    }

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const googleSignup = async (req, res, next) => {
  try {
    const { name, email, image, emailVerified } = req.body;

    if (!email || !name) {
      return next("Provide the required fields");
    }

    let user = await Users.findOne({ email });

    if (user) {
      const token = createJWT(user._id);

      return res.status(200).json({
        success: true,
        message: "Signed in successfully",
        user,
        token,
      });
    }

    user = await Users.create({
      name,
      email,
      image,
      provider: "Google",
      emailVerified: emailVerified ?? true,
    });

    user.password = undefined;
    const token = createJWT(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return next("Please provide your email address");
    }

    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      return next("Invalid email or password");
    }

    if (user.provider === "Google" && !user.password) {
      if (password) {
        return next("This account was created with Google. Use Google sign in.");
      }

      user.password = undefined;

      return res.status(200).json({
        success: true,
        message: "Signed in successfully",
        user,
        token: createJWT(user._id),
      });
    }

    if (!password) {
      return next("Please provide your password");
    }

    const isMatch = await compareString(password, user.password);

    if (!isMatch) {
      return next("Invalid email or password");
    }

    if (user.accountType === "Writer" && !user.emailVerified) {
      return next("Please verify your email address");
    }

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user,
      token: createJWT(user._id),
    });
  } catch (error) {
    next(error);
  }
};
