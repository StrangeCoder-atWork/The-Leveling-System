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
    const client = await clientPromise;
    const db = client.db("Leveling_System");

    const { 
      xp, 
      money, 
      tasks, 
      flashCards, 
      level, 
      rank, 
      personalData, 
      profession,
      title,
      streaks,
      streakHistory 
    } = body;

    await db.collection("users").updateOne(
      { _id: new ObjectId(token.id) },
      {
        $set: {
          xp,
          money,
          tasks,
          flashCards,
          level,
          rank,
          personalData,
          profession,
          title,
          streaks,
          streakHistory
        },
      }
    );

    return new Response(JSON.stringify({ message: "User data Synced successful" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Sync API Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
