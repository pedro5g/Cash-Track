import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoutes = createRouteMatcher(["/"]);

export default clerkMiddleware((auth, request) => {
  if (protectedRoutes(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
