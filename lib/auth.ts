import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember Me", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Password salah, silakan coba lagi atau daftar");
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordCorrect) {
          throw new Error("Password salah, silakan coba lagi atau daftar");
        }

        // Return user with remember flag
        return {
          ...user,
          rememberMe: credentials.remember === 'true'
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development",
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.rememberMe = (user as any).rememberMe;
      }

      // Enforce 24-hour limit if "Remember Me" is not checked
      if (token.rememberMe === false) {
        const iat = token.iat as number;
        if (iat) {
          const nowInSeconds = Math.floor(Date.now() / 1000);
          const oneDayInSeconds = 24 * 60 * 60;
          if (nowInSeconds - iat > oneDayInSeconds) {
            // Token has expired for non-remembered session
            return {}; // Effectively invalidates the session
          }
        }
      }

      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      
      // If remember me is NOT checked, we could set short expiration
      // But NextAuth doesn't easily allow per-session cookie expiry via standard callbacks.
      // A common way is to set standard maxAge and just handle it in JWT.
      
      return session;
    },
  },
};
