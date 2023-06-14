import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const secret = process.env.JWT_SECRET as string;

export default function generateToken(res: NextResponse, id: string) {
  const token = jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });

  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  console.log('res',res)
}
