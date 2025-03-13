import { NextRequest, NextResponse } from "next/server";
import { isSessionValid } from "@/lib/session";

const isPublicRoute = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname;
  const session = await isSessionValid();

  if (isPublicRoute.includes(pathName) && !session) {
    return NextResponse.next();
  }
  if (session && isPublicRoute.includes(pathName)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
