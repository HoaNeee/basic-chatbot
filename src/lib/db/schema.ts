import { TChat, TMessage } from "@/types/Chat.types";
import { TUser } from "@/types/User.types";
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "failed", "done"],
      default: "pending",
    },
    role: { type: String, enum: ["user", "model"], required: true },
    upVoted: { type: [String], default: [] },
    downVoted: { type: [String], default: [] },
    intent: { type: String, enum: ["weather", "general"], default: "general" },
    data: { type: Object },
  },
  { timestamps: true }
);

const Message =
  (mongoose.models.Message as mongoose.Model<TMessage>) ||
  mongoose.model("Message", messageSchema, "messages");

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const Chat =
  (mongoose.models.Chat as mongoose.Model<TChat>) ||
  mongoose.model("Chat", chatSchema, "chats");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as mongoose.Model<TUser>) ||
  mongoose.model("User", userSchema, "users");

export { Chat, Message, User };
