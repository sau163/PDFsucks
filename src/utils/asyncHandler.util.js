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
            statusCode: error.statusCode,
            errors: error.errors,
            stack: error.stack.trim(),
            message: error.message
        });
      } else {
        otherError = new ApiError(500, error.message, error.name, error.stack);
        return res
          .status(otherError.statusCode)
          .json({
            success: otherError.success,
            statusCode: otherError.statusCode,
            error: otherError.name,
            stack: otherError.stack.trim(),
            message: otherError.message
        });
      }
    });
  }
};

export { asyncHandler };
