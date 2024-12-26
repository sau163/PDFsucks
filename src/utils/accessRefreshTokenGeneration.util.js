import { ApiError } from "./error.util.js";

export const generateAccessRefreshTokens = async (user) => {
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return {accessToken, refreshToken, user};
  } catch (error) {
    throw new ApiError(500, "failed to generate access and refresh tokens");
  }
};
