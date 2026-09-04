const errorMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: 500,
    success: false,
    message: typeof err === "string" ? err : err?.message || "Something went wrong",
  };

  console.log(err);

  if (typeof err === "string") {
    defaultError.statusCode = 404;
  }

  if (err?.name === "ValidationError") {
    defaultError.statusCode = 400;
    defaultError.message = Object.values(err.errors)
      .map((el) => el.message)
      .join(", ");
  }

  if (err?.name === "CastError") {
    defaultError.statusCode = 400;
    defaultError.message = `Invalid value for ${err.path}`;
  }

  if (err?.code === 11000) {
    defaultError.statusCode = 409;
    defaultError.message = `${Object.keys(err.keyValue).join(", ")} field has to be unique`;
  }

  res.status(defaultError.statusCode).json({
    success: defaultError.success,
    message: defaultError.message,
  });
};

export default errorMiddleware;
