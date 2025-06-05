import { getToken } from "next-auth/jwt";
import { initSendGrid, sendLoginNotificationEmail } from "@/lib/sendgrid";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { browserInfo, loginTime } = await req.json();

    // Initialize SendGrid and send login notification email
    initSendGrid();
    await sendLoginNotificationEmail(
      token.email,
      token.username,
      loginTime || new Date().toLocaleString(),
      browserInfo || "Unknown"
    );

    return new Response(JSON.stringify({ message: "Login notification sent successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Login notification API error:", error);
    // Return success anyway to not block the user experience
    return new Response(JSON.stringify({ message: "Login notification processing" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}