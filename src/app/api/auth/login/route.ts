import connectDB from "@/lib/db/connect";
import { login } from "@/lib/db/queries";
import { errorHandler } from "@/lib/errors";
import { signJWT } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = errorHandler(async (req: NextRequest) => {
  await connectDB();

  const body = await req.json();
  const { email, password } = body;
  const data = await login(email, password);
  const res = NextResponse.json({ success: true, data }, { status: 200 });

  const maxAge = 60 * 60 * 24 * 7;

  const jwt_token = signJWT({ _id: data._id, email: data.email }, maxAge);
  res.cookies.set("jwt_token", jwt_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: maxAge,
  });

  res.cookies.delete("is_guest");

  return res;
});
