import connectDB from "@/lib/db/connect";
import { getChatHistoryWithUserId, saveChat } from "@/lib/db/queries";
import { errorHandler, MyRequest } from "@/lib/errors";
import { NextResponse } from "next/server";

export const POST = errorHandler(async (req: MyRequest) => {
  await connectDB();

  const userId = req.userId as string;

  const data = await saveChat(userId);
  const res = NextResponse.json({ success: true, data }, { status: 200 });

  return res;
});

export const GET = errorHandler(async (req: MyRequest) => {
  await connectDB();
  const userId = req.userId as string;
  const data = await getChatHistoryWithUserId(userId);
  return NextResponse.json({ success: true, data }, { status: 200 });
});
