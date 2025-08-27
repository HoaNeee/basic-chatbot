import { Chat, GoogleGenAI } from "@google/genai";
import { ApiError } from "../errors";

type ChatMessage = {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
};

const DEFAULT_HISTORY = [
  {
    role: "user",
    parts: [
      {
        text: "Xin chào!, bạn là một trợ lý ảo AI, bạn có thể giúp tôi với các câu hỏi và vấn đề của tôi?",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "Chào bạn! Rất vui được hỗ trợ bạn. Bạn đang có nhu cầu cụ thể nào không?",
      },
    ],
  },
];

class AIGemini {
  private ai: GoogleGenAI;
  private model: string;
  private chat: Chat | undefined;
  constructor(api_key: string, model = "gemini-2.0-flash-lite") {
    this.ai = new GoogleGenAI({
      apiKey: api_key,
    });
    this.model = model;
    this.chat = undefined;
  }

  createNewChat(initialHistory?: ChatMessage[]) {
    this.chat = this.ai.chats.create({
      model: this.model,
      history: initialHistory ?? DEFAULT_HISTORY,
    });
    return this.chat;
  }

  getChat() {
    return this.chat;
  }
  async sendMessage(content: string) {
    if (!this.chat) {
      throw new ApiError(
        500,
        "Chat not initialized. Call createNewChat first."
      );
    }

    const response = await this.chat?.sendMessage({
      message: content,
    });
    return response?.text;
  }

  async sendMessageStream(content: string) {
    if (!this.chat) {
      throw new ApiError(
        500,
        "Chat not initialized. Call createNewChat first."
      );
    }
    const response = await this.chat.sendMessageStream({
      message: content,
      config: {
        maxOutputTokens: 1500,
      },
    });

    return response;
  }

  async generateContent(prompt: string) {
    const response = await this.ai.models.generateContent({
      contents: prompt,
      model: this.model,
      config: {
        maxOutputTokens: 1000,
      },
    });
    return response.text;
  }

  async detectIntent(prompt: string) {
    const response = await this.ai.models.generateContent({
      contents: prompt,
      model: "gemini-1.5-flash",
      config: {
        maxOutputTokens: 500,
      },
    });
    return response.text;
  }
}

export const gemAI = new AIGemini(process.env.GOOGLE_API_KEY as string);
