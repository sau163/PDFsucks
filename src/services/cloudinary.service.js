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

export const uploadOnCloudinary = async(localFilePath, folder) => {
  try {
    if (!localFilePath) throw new ApiError(404, "File resource not exist to upload");

    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder,
      timeout: 60000
    });

    delete res.api_key;
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
}
