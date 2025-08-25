import connectDB from "@/lib/db/connect";
import { getMessageFromAI } from "@/lib/db/queries";
import { errorHandler } from "@/lib/errors";
import { fakeMiddleware } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

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
