import { NextResponse } from "next/server";

export default function errorResponse(message: string, statusCode?: number) {
  return NextResponse.json({ message, statusCode });
}
