// PUT /api/room-type/[id]
// DELETE /api/room-type/[id]

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";

const shecma = z.object({
  name: z.string(),
  price: z.number(),
  remark: z.string().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    await prisma.roomType.update({
      where: { id: id },
      data: shecma.parse(payload),
    });

    return NextResponse.json(
      { message: "อัพเดทข้อมูลสำเร็จ" },
      { status: 200 },
    );
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.roomType.update({
      where: { id: id },
      data: { status: "inactive" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
