import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next("Authentication failed");
  }

  const token = authHeader.split(" ")[1];

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    // Express 5 leaves req.body undefined when a request carries no body,
    // so make sure there is always an object to attach the user to.
    if (!req.body || typeof req.body !== "object") req.body = {};

    req.user = { userId: userToken.userId };
    req.body.user = { userId: userToken.userId };

    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    next("Authentication failed");
  }
};

export default userAuth;
