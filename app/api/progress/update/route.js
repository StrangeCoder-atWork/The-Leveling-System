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

    const { activity, date, completed } = await req.json();
    const today = date || new Date().toISOString().split('T')[0];

    if (!activity) {
      return new Response(JSON.stringify({ error: "Activity is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("Leveling_System");

    // Get current streaks
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(token.id) },
      { projection: { streaks: 1, streakHistory: 1 } }
    );

    const streaks = user?.streaks || {
      workout: 0,
      study: 0,
      work: 0,
      other: 0
    };

    const history = user?.streakHistory || {};

    // Update streak count
    if (completed) {
      streaks[activity] = (streaks[activity] || 0) + 1;
    }

    // Update history
    if (!history[today]) {
      history[today] = {};
    }
    history[today][activity] = completed;

    // Update in database
    await db.collection("users").updateOne(
      { _id: new ObjectId(token.id) },
      {
        $set: {
          streaks,
          streakHistory: history
        }
      }
    );

    return new Response(JSON.stringify({ 
      message: "Progress updated successfully",
      streaks,
      history
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Progress Update API Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}