// Create this new file
import { getToken } from "next-auth/jwt";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const token = await getToken({ req });

    if (!token || !token.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { name, profession, bio } = body;
    
    const client = await clientPromise;
    const db = client.db("Leveling_System");

    await db.collection("users").updateOne(
      { _id: new ObjectId(token.id) },
      {
        $set: {
          "personalData.name": name,
          profession,
          "personalData.bio": bio
        },
      }
    );

    return new Response(JSON.stringify({ message: "Profile data updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Profile Data API Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}