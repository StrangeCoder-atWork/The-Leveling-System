import { getToken } from "next-auth/jwt";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { profession, personalData } = await req.json();

    if (!profession || typeof profession !== "string" || profession.trim() === "") {
      return new Response(JSON.stringify({ error: "Invalid profession" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (
      !personalData ||
      typeof personalData !== "object" ||
      !personalData.info ||
      typeof personalData.info !== "string"
    ) {
      return new Response(JSON.stringify({ error: "Invalid personal data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("Leveling_System");

    const result = await db.collection("users").updateOne(
      { email: token.email },
      {
        $set: {
          profession: profession.trim(),
          personalData,
          isSetupComplete: true,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found or data unchanged" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "User setup saved successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Setup API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
