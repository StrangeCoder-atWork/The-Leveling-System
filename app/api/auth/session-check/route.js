import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Check if user has completed setup
    const isFirstTime = !token.personalData || Object.keys(token.personalData).length === 0;
    const isGoogle = token.provider === "google";

    if (isFirstTime && !isGoogle) {
      return NextResponse.redirect(new URL('/setup', req.url));
    } else {
      return NextResponse.redirect(new URL('/home', req.url));
    }
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}