import { getToken } from "next-auth/jwt";
import clientPromise from "@/lib/mongodb";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import { initSendGrid, sendVerificationEmail } from "@/lib/sendgrid";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (token.provider === "google") {
      return new Response(JSON.stringify({ error: "Google users do not require email verification." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate verification token using JWT
    const verificationToken = jwt.sign(
      { email: token.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token valid for 24 hours

    // Store verification token in database
    const client = await clientPromise;
    const db = client.db("Leveling_System");

    await db.collection("users").updateOne(
      { email: token.email },
      {
        $set: {
          verificationToken,
          verificationExpires: expiresAt,
        },
      }
    );

    // Initialize SendGrid and send verification email
    initSendGrid();
    const result = await sendVerificationEmail(
      token.email,
      verificationToken,
      token.username
    );

    if (!result.success) {
      throw new Error("Failed to send verification email");
    }

    return new Response(JSON.stringify({ message: "Verification email sent successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Send verification API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}