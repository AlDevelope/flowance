import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const { amount, type, categoryId, accountId, date, note } = await req.json();

    // Verify ownership of account and category
    const [account, category] = await Promise.all([
      prisma.financeAccount.findFirst({ where: { id: accountId, userId: user.id } }),
      prisma.category.findFirst({ where: { id: categoryId, userId: user.id } })
    ]);

    if (!account || !category) {
      return NextResponse.json({ message: "Account or Category not found or unauthorized" }, { status: 403 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        categoryId,
        accountId,
        date: new Date(date),
        note,
        userId: user.id,
      }
    });

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const transactions = await prisma.transaction.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
