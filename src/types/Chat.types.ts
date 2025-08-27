/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TChat {
  _id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TMessage {
  _id?: string;
  chatId: string;
  userId: string;
  role: "user" | "model";
  content: string;
  status?: "pending" | "failed" | "done";
  intent?: "weather" | "general";
  data?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
