// PUT /api/room-type/[id]
// DELETE /api/room-type/[id]

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";

const schema = z.object({
  name: z.string(),
  price: z.number(),
  remark: z.string().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = await req.json();
    const { name, price, remark } = schema.parse(payload);
    await prisma.roomType.update({
      where: { id: id },
      data: {
        name: name,
        price: price,
        remark: remark,
      },
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
    console.log((error as Error).message);
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

    return NextResponse.json({ message: "ลบข้อมูลสำเร็จ" }, { status: 200 });
  } catch (error) {
    console.log((error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
