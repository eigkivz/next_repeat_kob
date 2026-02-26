// GET /api/room-type
// POST /api/room-type

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function GET() {
  try {
    const res = await prisma.roomType.findMany();

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const schema = z.object({
      name: z.string(),
      price: z.number(),
      remark: z.string().optional(),
    });

    const payload = await req.json();
    const { name, price, remark } = schema.parse(payload);

    const res = await prisma.roomType.create({
      data: {
        name: name,
        price: price,
        remark: remark,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: (error as z.ZodError).issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
