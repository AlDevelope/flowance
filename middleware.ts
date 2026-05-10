import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/",
    "/transactions/:path*",
    "/categories/:path*",
    "/budgets/:path*",
    "/reports/:path*",
    "/profile/:path*",
  ],
};
