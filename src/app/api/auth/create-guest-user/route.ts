import { errorHandler } from "@/lib/errors";
import { genUUID, signJWT } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = errorHandler(async (req: Request) => {
  const maxAge = 60 * 60 * 24 * 15;

  const id = genUUID();

  const token = signJWT(
    {
      _id: id,
    },
    maxAge
  );

  const res = NextResponse.json(
    {
      success: true,
      data: {
        _id: id,
      },
    },
    { status: 200 }
  );

  res.cookies.set("jwt_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  res.cookies.set("is_guest", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return res;
});
