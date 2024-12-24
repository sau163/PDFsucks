import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { ApiError } from "../utils/error.util.js";

cloudinary.config(
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
);


