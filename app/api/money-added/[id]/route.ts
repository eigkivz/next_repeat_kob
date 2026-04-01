// PUT api/money-added/:id
// DELETE api/money-added/:id

import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }>}
) {
    try {
        const body = await req.json();
        const { id } = await params;

        const schema = z.object({
            name: z.string(),
            amount: z.number(),
            description: z.string().optional()
        });

        const { name, amount, description } = schema.parse(body);
        const moneyAdded = await prisma.moneyAdded.update({
            where: {
                id: id
            },
            data: {
                name: name,
                amount: amount,
                status: "active",
                description: description
            }
        });

        return NextResponse.json(moneyAdded);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: Request,
    { params } : { params: Promise<{ id: string }>}
) {
    try {
        const { id } = await params;

        const moneyAdded = await prisma.moneyAdded.update({
            where: { id: id },
            data: {
                status: "inactive"
            }
        });

        return NextResponse.json(moneyAdded);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        )
    }
}