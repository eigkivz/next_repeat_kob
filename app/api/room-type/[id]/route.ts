// PUT /api/room-type/[id]
// DELETE /api/room-type/[id]

import { NextResponse } from "next/server";
import z from "zod";

export function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }>}
) {
    try {

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: (error as z.ZodError).issues },
                { status: 400 }
            );
        };
        
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}