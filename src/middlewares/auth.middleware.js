import { ApiError } from "../utils/error.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { userSession } from "./userSession.middleware.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const isUserAuthenticated = userSession(req, res);
  if (isUserAuthenticated) {
    req.user = isUserAuthenticated.user;
    return next();
  }

  throw new ApiError(401, "unauthorized access");
});
