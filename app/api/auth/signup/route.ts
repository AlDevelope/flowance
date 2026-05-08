import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Create default categories for new user
        categories: {
          create: [
            { name: 'Makan & Minum', type: 'EXPENSE', color: '#F28B6E', icon: '🍔' },
            { name: 'Transportasi', type: 'EXPENSE', color: '#7BB8D4', icon: '🚗' },
            { name: 'Belanja', type: 'EXPENSE', color: '#8B5CF6', icon: '🛍️' },
            { name: 'Jajan', type: 'EXPENSE', color: '#F59E0B', icon: '🍦' },
            { name: 'Tagihan', type: 'EXPENSE', color: '#EF4444', icon: '🧾' },
            { name: 'Gaji', type: 'INCOME', color: '#4CAF85', icon: '💰' },
            { name: 'Freelance', type: 'INCOME', color: '#3B82F6', icon: '💻' },
          ]
        },
        // Create default accounts
        accounts: {
          create: [
            { name: 'Tunai', balance: 0, color: '#4CAF85', icon: '💵' },
            { name: 'E-Wallet', balance: 0, color: '#3B82F6', icon: '📱' },
          ]
        }
      }
    });

    return NextResponse.json({ 
      message: "User created successfully",
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error: any) {
    console.error("SIGNUP_ERROR", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
