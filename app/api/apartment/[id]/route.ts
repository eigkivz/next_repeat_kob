// PUT /api/apartment

import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    try {
    const payload = await req.json();
    const { id } = await params;

    const schema = z.object({
            name: z.string(),
            phone: z.string(),
            address: z.string(),
            email: z.email().optional(),
            lineId: z.string().optional(),
            taxCode: z.string()
    });

    const apartmentData = schema.parse(payload);

    await prisma.apartment.update({
        where: { id: id },
        data: apartmentData
    });

    return NextResponse.json({});

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: (error as z.ZodError).issues },
                { status: 400 }
            )
        };
        
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}