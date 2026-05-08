import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: true,
        categories: true,
        transactions: true,
        budgets: true,
      }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      accounts: user.accounts,
      categories: user.categories,
      transactions: user.transactions.map(t => ({
        ...t,
        date: t.date.toISOString(),
      })),
      budgets: user.budgets,
    });
  } catch (error) {
    console.error("DATA_FETCH_ERROR", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
