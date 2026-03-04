import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const schema = z.object({
            towerName: z.string(),
            totalLevel: z.number(),
            totalRoom: z.number(),
            roomTypeId: z.string(),
            remark: z.string().optional(),
        });

        const { towerName, totalLevel, totalRoom, roomTypeId, remark } = schema.parse(body);

        if (totalRoom > 0) {

            const computeTotalRoom = totalRoom * totalLevel;

            for (let i = 1; i <= totalLevel; i++) {
                for (let j = 1; j <= totalRoom; j++) {
                    // 1101
                    const roomNo = `${j}`.padStart(2, "0");
                    const roomName = `${towerName}${i}${roomNo}`;

                    await prisma.room.create({
                        data: {
                            name: roomName,
                            towerName: towerName,
                            totalLevel: totalLevel,
                            totalRoom: computeTotalRoom,
                            remark: remark,
                            status: "active",
                            statusEmpty: "empty",
                            roomTypeId: roomTypeId
                        }
                    })

                }
            }

            return NextResponse.json(
                { message: "สร้างห้องสำเร็จ" },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: "จำนวนห้องต้องมากกว่า 0"},
            { status: 400 }
        )
        
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message},
            { status: 500 }
        )
    }
}