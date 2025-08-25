import { gemAI } from "@/lib/ai/models";
import { promptTitle } from "@/lib/ai/prompt";
import connectDB from "@/lib/db/connect";
import {
  deleteChat,
  getChatWithId,
  getMessageFromAI,
  updateChat,
} from "@/lib/db/queries";
import { ApiError, errorHandler } from "@/lib/errors";
import { fakeMiddleware } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = errorHandler(async (req: NextRequest, { params }) => {
  await connectDB();

  const { id } = await params;

  const userId = fakeMiddleware(req);
  const data = await getChatWithId(id, userId);

  return NextResponse.json({ success: true, data }, { status: 200 });
});

export const POST = errorHandler(async (req: NextRequest, { params }) => {
  await connectDB();

  const { content } = await req.json();

  const { id } = await params;

  const userId = fakeMiddleware(req);

  const data = await getMessageFromAI(id, userId, content);

  return new NextResponse(data, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
});

export const PATCH = errorHandler(async (req: NextRequest, { params }) => {
  await connectDB();

  const { id } = await params;
  const body = await req.json();

  const content = body?.content;
  const title = body?.title;

  const userId = fakeMiddleware(req);

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const prompt = promptTitle(content);

  const newTitle = content ? await gemAI.generateContent(prompt) : title;

  const newChat = await updateChat(id, { title: newTitle });

  return NextResponse.json({ success: true, data: newChat }, { status: 200 });
});

export const DELETE = errorHandler(async (req: NextRequest, { params }) => {
  await connectDB();

  const { id } = await params;

  const userId = fakeMiddleware(req);

  await deleteChat(id, userId);

  return NextResponse.json({ success: true }, { status: 200 });
});
