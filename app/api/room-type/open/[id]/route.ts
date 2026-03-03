// PUT /api/roomt-type/open/[id]

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.roomType.update({
      where: { id: id },
      data: {
        status: "active",
      },
    });

    return NextResponse.json(
        { status: "เปิดใช้งานสำเร็จ" },
        { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
