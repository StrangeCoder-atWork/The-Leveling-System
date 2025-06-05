import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { initSendGrid, sendVerificationEmail } from "@/lib/sendgrid";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("Leveling_System");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      xp: 0,
      money: 0,
      level: 1,
      rank: "E",
      personalData: {},
      profession: "Student",
      provider: "credentials",
      emailVerified: false,
      verificationToken,
      verificationExpires: expiresAt
    };

    await db.collection("users").insertOne(newUser);

    // Send verification email
    initSendGrid();
    const emailResult = await sendVerificationEmail(
      email,
      verificationToken,
      username
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
    }

    return new Response(JSON.stringify({ 
      message: "User created successfully. Please check your email for verification." 
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Signup API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
