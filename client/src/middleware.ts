import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  // pass current path to layout
  response.headers.set("x-pathname", request.nextUrl.pathname);

  return response;
}