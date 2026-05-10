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

    const { categoryId, amount, month } = await req.json();

    // Verify category ownership
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: user.id }
    });

    if (!category) {
      return NextResponse.json({ message: "Category not found or unauthorized" }, { status: 403 });
    }

    const budget = await prisma.budget.create({
      data: {
        categoryId,
        amount,
        month,
        userId: user.id
      }
    });

    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
