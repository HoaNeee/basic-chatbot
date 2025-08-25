import connectDB from "@/lib/db/connect";
import { register } from "@/lib/db/queries";
import { errorHandler } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

export const POST = errorHandler(async (req: NextRequest) => {
  await connectDB();

  const body = await req.json();
  const { email, password } = body;
  const data = await register(email, password);
  return NextResponse.json({ success: true, data }, { status: 201 });
});
