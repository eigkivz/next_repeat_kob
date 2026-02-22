// GET /api/apartment
// POST /api/apartment

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function GET() {
  try {
    const apartmentData = await prisma.apartment.findFirst({});
    
    return NextResponse.json(apartmentData ?? { message: "ไม่พบข้อมูล หรือข้อมูลยังไม่ถูกเพิ่ม"});
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(
    req: Request
) {
  try {
    const schema = z.object({
        name: z.string(),
        phone: z.string(),
        address: z.string(),
        email: z.email().optional(),
        lineId: z.string().optional(),
        taxCode: z.string()
    });

    const data = await req.json();
    const apartmentSave = schema.parse(data);

    // created apartment data
    const createApartment = await prisma.apartment.create({
        data: apartmentSave
    });

    return NextResponse.json(createApartment);
  } catch (error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json(
            { error: (error as z.ZodError).issues },
            { status: 400 }
        );
    }

    return NextResponse.json(
        { error: (error as Error).message },
        { status: 500 }
    );
  }
}
