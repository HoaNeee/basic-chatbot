import connectDB from "@/lib/db/connect";
import { getChatHistoryWithUserId, getUser } from "@/lib/db/queries";
import { verifyJWT } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectDB();

    const cookie = await cookies();

    const token = cookie.get("jwt_token")?.value;
    const isGuest = cookie.get("is_guest")?.value === "true";

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const data = verifyJWT(token);

    if (isGuest) {
      return NextResponse.json(
        {
          success: true,
          data: data,
        },
        { status: 200 }
      );
    }

    const user = await getUser(data.email);

    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
