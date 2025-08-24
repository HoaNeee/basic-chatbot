import connectDB from "@/lib/db/connect";
import { getMessageFromAI } from "@/lib/db/queries";
import { errorHandler, MyRequest } from "@/lib/errors";
import { NextResponse } from "next/server";

export const POST = errorHandler(async (req: MyRequest, { params }) => {
  await connectDB();

  const { content } = await req.json();

  const { id } = await params;

  const userId = req.userId;

  const data = await getMessageFromAI(id, userId, content);

  return new NextResponse(data, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
});
