import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const authRoutes = new Set(["/dashboard/login", "/register"]);

function isSafeCallbackUrl(value: string | null): value is string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/dashboard/login", request.url);
  const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.searchParams.set("callbackUrl", callbackUrl);

  return NextResponse.redirect(loginUrl);
}

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  const isLoggedIn = Boolean(request.auth?.user);
  const isAuthRoute = authRoutes.has(pathname);
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isProductDetailRoute =
    pathname.startsWith("/produk/") || pathname.startsWith("/product/");
  const isProductMutation =
    pathname.startsWith("/product") && request.method === "POST";

  if (isAuthRoute && isLoggedIn) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const target = isSafeCallbackUrl(callbackUrl) ? callbackUrl : "/dashboard";

    return NextResponse.redirect(new URL(target, request.url));
  }

  if (isDashboardRoute && !isAuthRoute && !isLoggedIn) {
    return redirectToLogin(request);
  }

  if (isProductDetailRoute && !isLoggedIn) {
    return redirectToLogin(request);
  }

  if (isProductMutation) {
    if (!isLoggedIn) {
      return redirectToLogin(request);
    }

    if (request.auth?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/login",
    "/register",
    "/dashboard/:path*",
    "/product/:path*",
    "/produk/:path*",
  ],
};
