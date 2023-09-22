const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong try again later",
  };

  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(" ,");
    customError.code = StatusCodes.VALIDATION_ERROR;
  }

  if (err.name === "CastError") {
    customError.message = `No item found with ${err.value}`;
    customError.code = StatusCodes.NOT_FOUND;
  }

  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value for ${Object.keys(
      err.keyValue
    )}, please choose a different value`;
    customError.code = StatusCodes.VALIDATION_ERROR;
  }

  return res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
