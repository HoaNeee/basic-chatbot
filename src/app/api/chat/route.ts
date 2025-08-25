import connectDB from "@/lib/db/connect";
import { getChatHistoryWithUserId, saveChat } from "@/lib/db/queries";
import { errorHandler } from "@/lib/errors";
import { fakeMiddleware } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = errorHandler(async (req: NextRequest) => {
  await connectDB();

  const userId = fakeMiddleware(req);

  const data = await saveChat(userId);
  const res = NextResponse.json({ success: true, data }, { status: 200 });

  return res;
});

export const GET = errorHandler(async (req: NextRequest) => {
  await connectDB();
  const userId = fakeMiddleware(req);
  const data = await getChatHistoryWithUserId(userId);
  return NextResponse.json({ success: true, data }, { status: 200 });
});
