import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

function assignUserToToken(token, user) {
  token.user = user;
  const id = user._id || user.id; // ✅ fallback if _id is missing
  token.id = id?.toString();      // ✅ avoid crash if still undefined

  token.username = user.username;
  token.xp = user.xp ?? 0;
  token.money = user.money ?? 0;
  token.level = user.level ?? 1;
  token.rank = user.rank ?? "E-Rank";
  token.tasks = user.tasks ?? {};
  token.flashCards = user.flashCards ?? {};
  token.personalData = user.personalData ?? {};
  token.profession = user.profession ?? "Student";
  token.provider = user.provider ?? "credentials";
  token.emailVerified = user.emailVerified ?? false;
}


const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          const db = client.db("Leveling_System");
      
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials");
          }
      
          const user = await db.collection("users").findOne({ email: credentials.email });
      
          if (!user) {
            console.log("User not found");
            return null;
          }
      
          const isValid = await bcrypt.compare(credentials.password, user.password);
      
          if (!isValid) {
            console.log("Invalid password");
            return null;
          }
      
          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            xp: user.xp ?? 0,
            money: user.money ?? 0,
            level: user.level ?? 1,
            rank: user.rank ?? "E",
            tasks: user.tasks ?? {},
            flashCards: user.flashCards ?? {},
            personalData: user.personalData ?? {},
            profession: user.profession ?? "Student",
            emailVerified: user.emailVerified ?? false,
          };
      
        } catch (err) {
          console.error("❌ Authorize error:", err);
          return null; // Prevents crashing the server and causing 500 errors
        }
      }      
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      const client = await clientPromise;
      const db = client.db("Leveling_System");

      if (user) {
        // For credentials provider, user object already has _id
        assignUserToToken(token, user);
        token.emailVerified = user.emailVerified || false;
      }
      
      if (account?.provider === "google" && token.email) {
        let existingUser = await db.collection("users").findOne({ email: token.email });
        if (existingUser) {
          // Remove email verification check for Google users
          await db.collection("users").updateOne(
            { email: token.email },
            { $set: { provider: "google", emailVerified: true } }
          );
          // Fetch the updated user
          existingUser = await db.collection("users").findOne({ email: token.email });
          assignUserToToken(token, existingUser);
        } else {
          // Create new user for Google login
          const newUser = {
            email: token.email,
            username: token.name?.split(" ").join("_").toLowerCase() + "_" + Math.floor(Math.random() * 10000),
            xp: 0,
            money: 0,
            level: 1,
            rank: "E",
            tasks: {},
            flashCards: {},
            personalData: {},
            profession: "Student",
            provider: "google",
            emailVerified: true
          };
          const result = await db.collection("users").insertOne(newUser);
          assignUserToToken(token, { ...newUser, _id: result.insertedId });
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
        session.id = token.id; // This will now correctly be the _id string
        session.username = token.username;
        session.xp = token.xp;
        session.money = token.money;
        session.level = token.level;
        session.rank = token.rank;
        session.tasks = token.tasks;
        session.flashCards = token.flashCards;
        session.personalData = token.personalData;
        session.profession = token.profession;
        session.emailVerified = token.emailVerified;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
