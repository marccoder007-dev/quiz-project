const errorMiddleWare = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log("Error handled by middleware:", err);

  // Mongoose invalid object ID string
  if (err.name === "CastError") {
    const message = "Ressource not found. Invalid ID format";
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");

    error = new Error(messages);
    error.statusCode = 400;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicated field value entered: ${Object.keys(err.keyValue)}`;
    error = new Error(message);
    error.statusCode = 400;
  }

  return res
    .status(error.statusCode || 500)
    .json({ status: "fail", message: error.message || "Server Error" });
};

export default errorMiddleWare;
