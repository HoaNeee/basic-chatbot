import connectDB from "@/lib/db/connect";
import { Message } from "@/lib/db/schema";
import { ApiError, errorHandler } from "@/lib/errors";
import { fakeMiddleware } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = errorHandler(async (req: NextRequest, { params }) => {
  await connectDB();

  const { id, action, message_id } = await params;

  const body = await req.json();

  const user_id_client = body.userId;

  const userId = fakeMiddleware(req);

  if (user_id_client !== userId) {
    throw new ApiError(403, "Forbidden");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const message = await Message.findOne({
    _id: message_id,
    userId,
    chatId: id,
  });

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  switch (action) {
    case "up-vote":
      if (!message.upVoted?.includes(userId)) {
        message.upVoted?.push(userId);
      }

      const index = message.downVoted?.indexOf(userId) as number;
      if (index !== -1) {
        message.downVoted?.splice(index, 1);
      }
      await message.save();

      return NextResponse.json({ success: true, data: {} }, { status: 200 });
    case "down-vote":
      if (!message.downVoted?.includes(userId)) {
        message.downVoted?.push(userId);
      }

      const idx = message.upVoted?.indexOf(userId) as number;
      if (idx !== -1) {
        message.upVoted?.splice(idx, 1);
      }
      await message.save();

      return NextResponse.json({ success: true, data: {} }, { status: 200 });
    default:
      throw new ApiError(404, "Route not found");
  }
});
