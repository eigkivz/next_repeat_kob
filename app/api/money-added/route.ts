// GET api/money-added
// POST api/money-added

import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const moneyAdded = await prisma.moneyAdded.findMany({
            orderBy: {
                createdAt: "desc"
            },
            where: {
                status: "active"
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

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const schema = z.object({
            name: z.string(),
            amount: z.number(),
            description: z.string().optional()
        });

        const { name, amount, description } = schema.parse(body);
        const  moneyAdded = await prisma.moneyAdded.create({
            data: {
                name: name,
                amount: amount,
                status: "active",
                description: description
            }
        })

        return NextResponse.json(moneyAdded);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        )
    }
}
