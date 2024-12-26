import { ApiError } from "./error.util.js";

const asyncHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise
    .resolve(reqHandler(req, res, next))
    .catch((error) => {
      if (error instanceof ApiError) {
        return res
          .status(error.statusCode || 500)
          .json({
            success: error.success,
            message: error.message,
            errors: error.errors
        });
      } else {
        return res
          .status(500)
          .json({
            success: false,
            message: error.message
        });
      }
    });
  }
};

export { asyncHandler };
