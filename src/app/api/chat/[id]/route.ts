import { gemAI } from "@/lib/ai/models";
import { promptIntent, promptTitle } from "@/lib/ai/prompt";
import { userId_test } from "@/lib/contants";
import connectDB from "@/lib/db/connect";
import {
  deleteChat,
  getChatWithId,
  getMessageFromAI,
  getMessageWeather,
  updateChat,
} from "@/lib/db/queries";
import { ApiError, errorHandler } from "@/lib/errors";
import { fakeMiddleware, parseJSONFromAI } from "@/lib/utils";
import { IntentResponse } from "@/types/Response.types";
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
  // const userId = userId_test;

  const response_intent = (await gemAI.detectIntent(
    promptIntent(content)
  )) as string;

  const object = parseJSONFromAI(response_intent) as IntentResponse;
  console.log("Detected intent:", object);

  if (object.intent === "general") {
    const data = await getMessageFromAI(id, userId, object.content || content);
    return new NextResponse(data, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  }

  const location = object.location;

  if (!location) {
    throw new ApiError(400, "Location not found");
  }

  const data = await getMessageWeather(id, userId, content, location);

  const res = NextResponse.json({ success: true, data }, { status: 200 });

  return res;
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
