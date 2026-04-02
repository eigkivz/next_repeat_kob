// GET /api/water-and-electricity-price
// POST /api/water-and-electricity-price 219

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  try {
    const waterAndElectricityPrice =
      await prisma.waterAndElectricityPrice.findFirst();
    return NextResponse.json(
      waterAndElectricityPrice ?? {
        id: null,
        electricityPricePerUnit: 0,
        waterPricePerUnit: 0,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const schema = z.object({
      waterPricePerUnit: z.number(),
      electricityPricePerUnit: z.number(),
    });

    const validatedBody = schema.parse(body);
    const waterAndElectricityPrice =
      await prisma.waterAndElectricityPrice.create({
        data: validatedBody,
      });

    return NextResponse.json(waterAndElectricityPrice);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
