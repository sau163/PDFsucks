import { ApiError } from "../utils/error.util.js";
import { ApiResponse } from "../utils/response.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  emailValidation,
  passwordValidation,
  existValidation
} from "../validations/user/index.js";
import { generateAccessRefreshTokens } from "../utils/accessRefreshTokenGeneration.util.js";
import { COOKIE_OPTIONS } from "../constants.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const userRegistration = asyncHandler(async (req, res) => {
  // Algorithm
  // 1. Get user credencials with these fields from frontend
  // 2. Apply validation checks
  // 3. Create user entry in database
  // 4. remove password (encrypted) from response
  // 5. return response

  const { fullName, email, username, password } = req.body;
  if (!(fullName && email && username && password)) throw new ApiError(400, "all fields are necessary");

  await existValidation(username, email); // This is a database-query based operation, its fatal if not handled with care -> server halts. Took 1 hr to debug, lost my sanity in process, only femboys can save me.
  emailValidation(email);
  passwordValidation(password);

  const user = await User.create(
    {
      fullName: fullName,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: password
    }
  )

  if (!user) throw new ApiError(500, "failed to create new user");

  const { accessToken, refreshToken } = await generateAccessRefreshTokens(user);
  const createdUser = { ...user };
  delete createdUser._doc.password;
  delete createdUser._doc.refreshToken;

  return res
    .status(201)
    .cookie("accessToken", accessToken, {COOKIE_OPTIONS, maxAge: 86400000 * process.env.ACCESS_TOKEN_COOKIE_EXPIRY}) // 1 Day
    .cookie("refreshToken", refreshToken, {COOKIE_OPTIONS, maxAge: 86400000 * process.env.REFRESH_TOKEN_COOKIE_EXPIRY}) // 10 Days
    .json(
      new ApiResponse(
        200,
        "",
        "user created successfully",
        createdUser._doc
      )
    );
});

export const userLogin = asyncHandler(async (req, res) => {
  // Algorithm
  // 1. Take user credencials
  // 2. search for user in database and validate with database credentials (email / username, password)
  // 3. generate Access and Refresh tokens
  // 4. send cookies

  const { username, password } = req.body;
  if (!(username && password)) throw new ApiError(400, "provide login credentials");

  let loggedInUser = username.includes('@') ? await User.findOne({email: username}) : await User.findOne({username: username});
  if (!loggedInUser) throw new ApiError(404, "no such user with given credentials");
  
  const isEnteredPasswordCorrect = await loggedInUser.isPasswordCorrect(password);
  if (!isEnteredPasswordCorrect) throw new ApiError(401, "incorrect password incorrect");

  const { accessToken, refreshToken, user } = await generateAccessRefreshTokens(loggedInUser);
  loggedInUser = { ...user };
  delete loggedInUser._doc.password;
  delete loggedInUser._doc.refreshToken;

  return res
    .status(200)
    .cookie("accessToken", accessToken, {COOKIE_OPTIONS, maxAge: 86400000 * process.env.ACCESS_TOKEN_COOKIE_EXPIRY}) // 1 Day
    .cookie("refreshToken", refreshToken, {COOKIE_OPTIONS, maxAge: 86400000 * process.env.REFRESH_TOKEN_COOKIE_EXPIRY}) // 10 Days
    .json(
      new ApiResponse(
        200,
        "",
        "user logged in successfully",
        loggedInUser._doc
      )
    );
});
