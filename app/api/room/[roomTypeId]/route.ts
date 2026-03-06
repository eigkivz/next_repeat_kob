import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
    req: Request,
    { params }: { params: Promise<{roomTypeId: string}>}
) {
    try {
        const { roomTypeId } = await params;
        const rooms =await prisma.room.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                roomType: true
            },
            where: {
                id: roomTypeId
            }
        });

         return NextResponse.json(rooms);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message},
            { status: 500}
        )
    }
}

