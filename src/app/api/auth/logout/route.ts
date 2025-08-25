import { ApiError, errorHandler } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

export const POST = errorHandler(async (req: NextRequest) => {
  const res = NextResponse.json({ success: true }, { status: 200 });

  const isGuest = res.cookies.get("is_guest")?.value === "true";

  if (isGuest) {
    throw new ApiError(400, "User is not logged in");
  }

  res.cookies.delete("jwt_token");
  res.cookies.set("is_guest", "true");

  return res;
});
