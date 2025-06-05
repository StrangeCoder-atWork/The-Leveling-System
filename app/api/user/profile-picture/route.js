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

    const formData = await req.formData();
    const file = formData.get('profilePicture');
    
    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Convert file to Base64 for storage in MongoDB
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    
    const client = await clientPromise;
    const db = client.db("Leveling_System");

    await db.collection("users").updateOne(
      { _id: new ObjectId(token.id) },
      {
        $set: {
          profilePicture: base64Image
        },
      }
    );

    return new Response(JSON.stringify({ message: "Profile picture updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Profile Picture API Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}