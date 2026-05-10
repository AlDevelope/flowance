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

    const { name, type, color, icon } = await req.json();

    const category = await prisma.category.create({
      data: {
        name,
        type,
        color,
        icon,
        userId: user.id
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
