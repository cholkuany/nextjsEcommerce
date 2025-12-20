import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AiFillFacebook } from "react-icons/ai";

import type { Provider } from "next-auth/providers";
import type { ComponentType } from "react";
import type { IconBaseProps } from "react-icons";

import type { NextAuthConfig } from "next-auth";

// Define providers
const providers: Provider[] = [
  Credentials({
    credentials: { password: { label: "Password", type: "password" } },
    authorize(c) {
      if (c.password !== "password") return null;
      return {
        id: "test",
        name: "Test User",
        email: "test@example.com",
      };
    },
  }),
  GitHub,
  Google,
  Facebook,
];

// Mapping with icons
export const providerMap = providers
  .map((provider) => {
    const p = typeof provider === "function" ? provider() : provider;

    let icon: ComponentType<IconBaseProps> | null = null;
    switch (p.id) {
      case "google":
        icon = FcGoogle;
        break;
      case "github":
        icon = FaGithub;
        break;
      case "facebook":
        icon = AiFillFacebook;
        break;
    }

    return {
      id: p.id,
      name: p.name,
      icon,
    };
  })
  .filter((p) => p.id !== "credentials");

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  providers: providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // from DB
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role && session.user) {
        session.user.role = token.role as "user" | "admin" | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
