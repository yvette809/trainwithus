// customMiddleware.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
/* 
type SessionData = {
  name: String;
  value: String;
  payload: String;
}; */

export  function getSession(){
  const session= cookies().get("session");

  try {
    if (!session) {
      return new NextResponse("Unauthorised, no token", { status: 401 });
    }
    const payload = jwt.verify(session.value, process.env.JWT_SECRET || "");
    return { session, payload };
  } catch (err) {
    return new NextResponse("Unauthorised, no token", { status: 401 });
  }
}
