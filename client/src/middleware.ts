import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // Redirect alternate domain → main domain (301 permanent)
  if (
    host === "www.inspireeductionservices.com" ||
    host === "inspireeductionservices.com"
  ) {
    const url = request.nextUrl.clone();
    url.host = "inspireeducationservice.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, { status: 301 });
  }

  // Pass current path to layout via response header
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);

  return response;
}