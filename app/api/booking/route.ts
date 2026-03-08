// POST /api/booking
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const schema = z.object({
      customerName: z.string(),
      customerPhone: z.string(),
      customerAddress: z.string(),
      customerCardId: z.string(),
      customerGender: z.string(),
      deposit: z.number().default(0),
      remark: z.string().optional(),
      roomId: z.string(),
      status: z.string(),
      stayAt: z.date(),
      stayUntil: z.date().optional(),
    });

    const {
      customerName,
      customerPhone,
      customerAddress,
      customerCardId,
      customerGender,
      deposit,
      remark,
      roomId,
      status,
      stayAt,
      stayUntil,
    } = schema.parse(body);

    // create booking
    await prisma.booking.create({
      customerName: customerName,
      customerPhone: customerPhone,
      customerAddress: customerAddress,
      customerCardId: customerCardId,
      customerGender: customerGender,
      deposit: deposit,
      remark: remark,
      roomId: roomId,
      status: "active",
      stayAt: stayAt,
      stayUntil: stayUntil,
    });

    // update room status to not empty
    await prisma.room.update({
        where: { roomId: roomId },
        data: { statusEmpty: "notempty"}
    });
    
    return NextResponse.json({ message: "จองห้องพักสำเร็จ" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
