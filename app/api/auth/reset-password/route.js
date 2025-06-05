import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.email !== email) {
        throw new Error('Token email mismatch');
      }
    } catch (jwtError) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("Leveling_System");

    const user = await db.collection("users").findOne({
      email,
      resetToken: token,
      resetTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid or expired reset link" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and remove reset token
    await db.collection("users").updateOne(
      { email },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpires: "" }
      }
    );

    return new Response(JSON.stringify({ message: "Password has been reset successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Reset password API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}