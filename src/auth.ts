import NextAuth from "next-auth";

import dbConnect, { getMongoAdapter } from "@/app/lib/mongodbConnection";
import { authConfig } from "./auth.config";
import User from "@/models/user";

type RoleType = "user" | "admin" | undefined;

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: await getMongoAdapter(),
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        await dbConnect();
        const dbUser = await User.findById({ _id: user.id });
        token.role = dbUser?.role ?? "user"; // fallback if undefined
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as RoleType;
      }
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      const db = (await import("@/app/lib/mongodbConnection")).default;
      const mongoose = await db();
      if (mongoose.connection.db) {
        const usersCount = await mongoose.connection.db
          .collection("users")
          .countDocuments();

        const isFirstUser = usersCount === 1;
        const assignedRole = isFirstUser ? "admin" : "user";

        await mongoose.connection.db.collection("users").updateOne(
          { _id: new mongoose.Types.ObjectId(user.id) },
          {
            $set: { role: assignedRole },
          }
        );

        console.log(`👤 Created user with role: ${assignedRole}`);
      }
    },
  },
});
