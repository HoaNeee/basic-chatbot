import { gemAI } from "@/lib/ai/models";
import { promptTitle } from "@/lib/ai/prompt";
import connectDB from "@/lib/db/connect";
import { getChatWithId, getMessageFromAI, updateChat } from "@/lib/db/queries";
import { errorHandler } from "@/lib/errors";
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
  const { content } = await req.json();

  const userId = fakeMiddleware(req);

  const { chat } = await getChatWithId(id, userId, false);

  const prompt = promptTitle(content);

  const title = await gemAI.generateContent(prompt);

  const newChat = await updateChat(chat._id, { title: title });

  return NextResponse.json({ success: true, data: newChat }, { status: 200 });
});
