import mongoose, { Schema } from "mongoose";

const querySchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export const Query = mongoose.model("Query", querySchema);
