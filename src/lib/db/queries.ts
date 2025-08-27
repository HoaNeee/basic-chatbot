/* eslint-disable @typescript-eslint/no-explicit-any */
import { TChat, TMessage } from "@/types/Chat.types";
import { gemAI } from "../ai/models";
import { ApiError } from "../errors";
import {
  hashPasswordUsingBcrypt,
  parseJSONFromAI,
  verifyPassword,
} from "../utils";
import { Chat, Message, User } from "./schema";
import { promptChat, promptWeather } from "../ai/prompt";
import { LocationResponse, WeatherResponse } from "@/types/Response.types";
import { isObjectIdOrHexString } from "mongoose";

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
    if (!userId) {
      return [];
    }
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
    const isObjectId = isObjectIdOrHexString(id);

    if (!id || !userId || !isObjectId) {
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

export const updateChat = async (
  id: string,
  userId: string,
  data: Partial<TChat>
) => {
  try {
    if (!id || !data) {
      throw new ApiError(400, "Bad request");
    }

    const chat = await Chat.findByIdAndUpdate(id, data, { new: true });

    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }

    if (chat.userId !== userId) {
      throw new ApiError(403, "Forbidden");
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
  status?: "failed" | "done" | "pending",
  intent = "general",
  data?: Record<string, any>
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
      intent,
      data,
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

export const updateMessage = async (id: string, message: Partial<TMessage>) => {
  try {
    if (!id || !message) {
      throw new ApiError(400, "Bad request");
    }

    const record = await Message.findByIdAndUpdate(id, message, { new: true });

    if (!record) {
      throw new ApiError(404, "Message not found");
    }

    return record;
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
  content: string,
  input?: string
) => {
  const message_user = await saveMessage(
    userId,
    chatId,
    input || content,
    "user"
  );
  const message_model = await saveMessage(
    userId,
    chatId,
    "content from AI",
    "model"
  );

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
        await updateMessage(String(message_model._id), {
          content: text,
          status: "done",
        });
      },
    });

    await updateMessage(String(message_user._id), {
      status: "done",
    });

    return stream;
  } catch (error) {
    if (message_user && message_model) {
      await Promise.all([
        updateMessage(String(message_user._id), { status: "failed" }),
        updateMessage(String(message_model._id), { status: "failed" }),
      ]);
    }

    throw error;
  }
};

export const deleteChat = async (chatId: string, userId: string) => {
  try {
    if (!userId || !chatId) {
      throw new ApiError(400, "Bad request");
    }

    const record = await Chat.findOneAndDelete({ _id: chatId, userId });
    await deleteMessages(chatId, userId);

    if (!record) {
      throw new ApiError(404, "Chat not found");
    }

    return record;
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};

export const deleteMessages = async (chatId: string, userId: string) => {
  try {
    if (!userId || !chatId) {
      throw new ApiError(400, "Bad request");
    }

    const records = await Message.deleteMany({ chatId, userId });

    if (records.deletedCount === 0) {
      throw new ApiError(404, "Messages not found");
    }

    return records;
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error");
  }
};

export const getMessageWeather = async (
  chatId: string,
  userId: string,
  content: string,
  location: string
) => {
  const message_user = await saveMessage(
    userId,
    chatId,
    content,
    "user",
    "pending",
    "weather"
  );
  const message_model = await saveMessage(
    userId,
    chatId,
    "content from AI",
    "model",
    "pending",
    "weather"
  );
  try {
    const weatherData = (await getWeatherData(location)) as WeatherResponse;

    const prompt = promptWeather(content, weatherData);

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

    const data = await gemAI.sendMessage(prompt);

    const response: {
      content: string;
      intent: string;
      data_weather: WeatherResponse;
    } = parseJSONFromAI(data);

    await Promise.all([
      updateMessage(String(message_user._id), {
        status: "done",
      }),
      updateMessage(String(message_model._id), {
        content: response.content,
        status: "done",
        intent: "weather",
        data: response.data_weather,
      }),
    ]);

    return response;
  } catch (error) {
    if (message_user && message_model) {
      await Promise.all([
        updateMessage(String(message_user._id), { status: "failed" }),
        updateMessage(String(message_model._id), { status: "failed" }),
      ]);
    }

    throw error;
  }
};

export const getMessageWithChatId = async (chatId: string, userId: string) => {
  try {
    if (!chatId) {
      throw new ApiError(400, "Bad request");
    }

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

const getWeatherData = async (location: string) => {
  try {
    const api_key = process.env.WEATHER_API_KEY;
    if (!api_key) {
      throw new ApiError(500, "Weather API key not found");
    }

    const location_response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${api_key}`
    );
    if (!location_response.ok) {
      return null;
    }
    const location_result =
      (await location_response.json()) as LocationResponse[];

    if (location_result.length === 0) {
      return null;
    }

    const lat = location_result[0].lat;
    const lon = location_result[0].lon;

    const weather_response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
    );

    if (!weather_response.ok) {
      return null;
    }
    const weather_result = (await weather_response.json()) as WeatherResponse;

    return weather_result;
  } catch (error) {
    throw error;
  }
};
