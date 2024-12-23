import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    chatTitle: {
      type: String  
    },
    chats: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Query"
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Chat = mongoose.model("Chat", chatSchema);
