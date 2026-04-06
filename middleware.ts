import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEFAULT_LOCALE, getSiteLocale } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const locale = getSiteLocale(firstSegment ?? DEFAULT_LOCALE);

  requestHeaders.set("x-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon.svg|robots.txt|rss.xml|sitemap.xml).*)"],
};
