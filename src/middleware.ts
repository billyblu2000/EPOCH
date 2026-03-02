import { type NextRequest, NextResponse } from "next/server";

// Lightweight middleware — auth is handled client-side by AuthProvider.
// This only refreshes Supabase auth cookies to keep the session alive.
export async function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
