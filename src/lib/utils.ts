import { userId_test } from "./contants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v1 } from "uuid";
import { compare, hash } from "bcrypt-ts";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { ApiError } from "./errors";

export const hashPasswordUsingBcrypt = async (password: string) => {
  const salt = 10;

  const hashPass = await hash(password, salt);
  return { salt, hashPass };
};

export const verifyPassword = async (
  password: string,
  hash_password: string
) => {
  return await compare(password, hash_password);
};

export const genUUID = () => {
  return v1();
};

export const signJWT = (payload: object, expires?: number) => {
  const secret = process.env.JWT_SECRET || "My-secret";
  const token = jwt.sign(
    payload,
    secret,
    expires ? { expiresIn: expires } : undefined
  );
  return token;
};

export const verifyJWT = (token: string) => {
  const secret = process.env.JWT_SECRET || "My-secret";
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as { _id: string; email: string; iat: number; exp: number };
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
};

export const fakeMiddleware = (req: NextRequest) => {
  const token = req.cookies.get("jwt_token")?.value;

  if (token) {
    const user = verifyJWT(token);
    return user._id;
  }

  throw new ApiError(401, "Unauthorized");

  return userId_test;
};

export const getValueInLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }
  return null;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
