import { TChat } from "@/types/Chat.types";
import { gemAI } from "../ai/models";
import { ApiError } from "../errors";
import { hashPasswordUsingBcrypt, verifyPassword } from "../utils";
import { Chat, Message, User } from "./schema";
import { promptChat } from "../ai/prompt";

export const login = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw new ApiError(400, "Bad request");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "Not found user");
    }

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      throw new ApiError(401, "Unauthorized");
    }

    const data = {
      _id: String(user._id),
      email: user.email,
    };
    return data;
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};

export const register = async (email: string, password: string) => {
  try {
    const exist = await User.findOne({ email });

    if (exist) {
      throw new ApiError(409, "Conflict - User already exists");
    }

    const { hashPass, salt } = await hashPasswordUsingBcrypt(password);

    const newUser = new User({ email, password: hashPass, salt });

    await newUser.save();

    const data = {
      email: newUser.email,
    };

    return data;
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};

export const getUser = async (email: string) => {
  try {
    const user = await User.findOne({ email }).select("email").lean();

    if (!user) {
      throw new ApiError(404, "Not found");
    }

    return user;
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};

export const getChatHistoryWithUserId = async (userId: string) => {
  try {
    const chat = await Chat.find({ userId }).lean().sort({ updatedAt: -1 });
    return chat;
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};

export const getChatWithId = async (
  id: string,
  userId: string,
  isMessage = true
) => {
  try {
    if (!id) {
      throw new ApiError(400, "Bad request");
    }

    const chat = await Chat.findOne({ _id: id }).lean();

    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }

    if (chat.userId !== userId) {
      throw new ApiError(403, "Forbidden");
    }

    if (isMessage) {
      const messages = await getMessageWithChatId(id, userId);

      return { chat, messages };
    }

    return { chat };
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};

export const saveChat = async (userId: string) => {
  try {
    if (!userId) {
      throw new ApiError(400, "Bad request");
    }

    const title = "Title Default";

    const record = new Chat({ userId, title });

    //not working...
    gemAI.createNewChat();

    await record.save();
    return record;
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};

export const updateChat = async (id: string, data: Partial<TChat>) => {
  try {
    if (!id || !data) {
      throw new ApiError(400, "Bad request");
    }

    const chat = await Chat.findByIdAndUpdate(id, data, { new: true });

    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }

    return chat;
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};

export const saveMessage = async (
  userId: string,
  chatId: string,
  content: string,
  role: string,
  status?: "failed" | "done" | "pending"
) => {
  try {
    if (!userId || !chatId || !content) {
      throw new ApiError(400, "Bad request");
    }

    const newMessage = new Message({
      userId,
      chatId,
      content: content,
      role: role,
      status: status || "pending",
    });

    await newMessage.save();
    return newMessage;
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};

export const updateStatusMessage = async (
  id: string,
  status: "failed" | "done" | "pending"
) => {
  try {
    if (!id || !status) {
      throw new ApiError(400, "Bad request");
    }

    const message = await Message.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!message) {
      throw new ApiError(404, "Message not found");
    }

    return message;
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};

export const getMessageFromAI = async (
  chatId: string,
  userId: string,
  content: string
) => {
  const message = await saveMessage(userId, chatId, content, "user");

  try {
    const messages = await getMessageWithChatId(chatId, userId);

    if (messages.length > 0) {
      const history = messages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));
      gemAI.createNewChat(history);
    } else {
      gemAI.createNewChat();
    }

    const prompt = promptChat(content);

    const res = await gemAI.sendMessageStream(prompt);

    if (!res) {
      throw new ApiError(500, "Failed to get response from AI");
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let text = "";
        for await (const chunk of res) {
          controller.enqueue(encoder.encode(chunk.text));
          text += chunk.text;
        }
        controller.close();
        await saveMessage(userId, chatId, text, "model", "done");
      },
    });

    await updateStatusMessage(String(message._id), "done");

    return stream;
  } catch (error) {
    if (message) {
      await updateStatusMessage(String(message._id), "failed");
    }
    throw error;
  }
};

const getMessageWithChatId = async (chatId: string, userId: string) => {
  try {
    if (!chatId) {
      throw new ApiError(400, "Bad request");
    }

    console.log(chatId, userId);

    const messages = await Message.find({ chatId })
      .lean()
      .sort({ createdAt: 1 });

    if (
      messages.length > 0 &&
      messages.some((item) => item.userId !== userId)
    ) {
      throw new ApiError(403, "Forbidden");
    }

    return messages;
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};
