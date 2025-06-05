import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { initSendGrid, sendPasswordResetEmail } from "@/lib/sendgrid";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("Leveling_System");

    const user = await db.collection("users").findOne({ email });

    // Don't reveal if the user exists or not for security reasons
    if (!user) {
      return new Response(JSON.stringify({ message: "If your email exists in our system, you will receive a password reset link" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { email: user.email, id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token valid for 1 hour

    // Store reset token in database
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpires: expiresAt,
        },
      }
    );

    // Send password reset email
    initSendGrid();
    const result = await sendPasswordResetEmail(
      user.email,
      resetToken,
      user.username
    );

    if (!result.success) {
      throw new Error("Failed to send password reset email");
    }

    return new Response(JSON.stringify({ message: "If your email exists in our system, you will receive a password reset link" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}