import connectDB from "@/lib/db/connect";
import { getUser } from "@/lib/db/queries";
import { verifyJWT } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
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

    if (!data) {
      console.log("Unauthorized access - JWT token deleted");
      const res = NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
      res.cookies.delete("jwt_token");
      return res;
    }

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
        data: user,
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
