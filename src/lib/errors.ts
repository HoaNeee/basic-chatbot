/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { fakeMiddleware } from "./utils";

export class ApiError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const getTypeError = (status: number) => {
  switch (status) {
    case 400:
      return new ApiError(400, "Bad Request");
    case 401:
      return new ApiError(401, "Unauthorized");
    case 403:
      return new ApiError(403, "Forbidden");
    case 404:
      return new ApiError(404, "Not Found");
    default:
      return new ApiError(500, "Internal Server Error");
  }
};

export interface MyRequest extends NextRequest {
  userId: string;
}

export const errorHandler = (
  handler: (req: MyRequest, { params }: { params: any }) => Promise<Response>
) => {
  return async (req: MyRequest, { params }: { params: any }) => {
    try {
      const userId = fakeMiddleware(req);

      if (!userId) {
        throw new Error("Unauthorized");
      }

      req.userId = userId;

      return await handler(req, { params });
    } catch (error: any) {
      console.log(error);
      const status = error.status || 500;
      return NextResponse.json(
        { error: error.message || getTypeError(status).message },
        { status }
      );
    }
  };
};
