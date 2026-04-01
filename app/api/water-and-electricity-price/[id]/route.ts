// PUT /api/water-and-electricity-price/[id]

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await req.json();
        const schema = z.object({
            waterPricePerUnit: z.number(),
            electricityPricePerUnit: z.number()
        });

        const validateBody = schema.parse(body);
        const waterAndElectricityPrice = await prisma.waterAndElectricityPrice.update({
            where: {
                id: (await params).id
            },
            data: validateBody
        });

        return NextResponse.json(waterAndElectricityPrice);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        )
    }
}