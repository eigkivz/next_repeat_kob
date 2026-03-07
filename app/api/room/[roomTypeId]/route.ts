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

export async function DELETE(
    req: Request,
    { params } : { params: Promise<{ roomTypeId: string }> }
) {
    try {
        const { roomTypeId } = await params;
        await prisma.room.update({
            where: { id: roomTypeId },
            data: {
                status: "inactive"
            }
        });

        return NextResponse.json(
            { message: "ลบข้อมูลสำเร็จ" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        )
    }
}

