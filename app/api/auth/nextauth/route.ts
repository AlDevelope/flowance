import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/login', // Adjust if you want to use custom login page
  },
  callbacks: {
    async session({ session, token, user }) {
      // You can inject data here
      return session;
    },
  },
});

export { handler as GET, handler as POST };
