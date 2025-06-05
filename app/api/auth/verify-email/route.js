import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.redirect(new URL('/login?error=Invalid verification link', req.url));
    }

    // Verify JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.email !== email) {
        throw new Error('Token email mismatch');
      }
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return NextResponse.redirect(new URL('/login?error=Invalid or expired verification link', req.url));
    }

    const client = await clientPromise;
    const db = client.db("Leveling_System");

    const user = await db.collection("users").findOne({
      email,
      verificationToken: token,
      verificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=Invalid or expired verification link', req.url));
    }

    if (user.provider === "google") {
      return NextResponse.redirect(new URL('/login?error=Google users do not require verification', req.url));
    }

    // Mark email as verified
    await db.collection("users").updateOne(
      { email },
      {
        $set: { emailVerified: true },
        $unset: { verificationToken: "", verificationExpires: "" }
      }
    );

    return NextResponse.redirect(new URL('/login?success=Email verified successfully! You can now log in.', req.url));
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(new URL('/login?error=Verification failed', req.url));
  }
}