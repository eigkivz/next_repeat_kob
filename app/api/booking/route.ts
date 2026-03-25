// POST /api/booking
import { z } from "zod";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const schema = z.object({
      customerName: z.string(),
      customerPhone: z.string(),
      customerAddress: z.string(),
      customerCardId: z.string(),
      customerGender: z.string(),
      deposit: z.number().default(0),
      remark: z.string().optional(),
      roomId: z.string(),
      status: z.string().optional(),
      stayAt: z.coerce.date(),
      stayUntil: z.coerce.date().optional(),
      waterUnit: z.number().default(0),
      electricityUnit: z.number().default(0),
    });

    const {
      customerName,
      customerPhone,
      customerAddress,
      customerCardId,
      customerGender,
      deposit,
      remark,
      roomId,
      status,
      stayAt,
      stayUntil,
      waterUnit,
      electricityUnit,
    } = schema.parse(body);

    const oldBooking = await prisma.booking.findFirst({
      where: {
        roomId: roomId,
        room: {
          statusEmpty: "notempty",
          status: "active",
        },
      },
    });

    let bookingId = "";

    if (oldBooking) {
      bookingId = oldBooking.id;

      // update booking
      await prisma.booking.update({
        where: {
          id: oldBooking.id,
        },
        data: {
          customerName: customerName,
          customerPhone: customerPhone,
          customerAddress: customerAddress,
          customerCardId: customerCardId,
          customerGender: customerGender,
          deposit: deposit,
          remark: remark,
          roomId: roomId,
          stayAt: stayAt,
          stayUntil: stayUntil,
        },
      });
    } else {
      // create booking
      const newBooking = await prisma.booking.create({
        data: {
          customerName: customerName,
          customerPhone: customerPhone,
          customerAddress: customerAddress,
          customerCardId: customerCardId,
          customerGender: customerGender,
          deposit: deposit,
          remark: remark,
          roomId: roomId,
          stayAt: stayAt,
          stayUntil: stayUntil,
        },
      });

      bookingId = newBooking.id;
    }

    // update room status to not empty
    await prisma.room.update({
      where: { id: roomId },
      data: { statusEmpty: "notempty" },
    });

    return NextResponse.json({ message: "จองห้องพักสำเร็จ" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues);
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

const updateUnitOfWaterAndElectricity = async (
  bookingId: string,
  waterUnit: number,
  electricityUnit: number
) => {
  // find old data
  const oldWaterUnit = await prisma.waterLog.findFirst({
    where: {
      bookingId: bookingId,
      waterUnit: waterUnit
    }
  });
  const oldElectricityUnit = await prisma.electricityLog.findFirst({
    where: {
      bookingId: bookingId,
      electricityUnit: electricityUnit
    }
  });
  
  // update or create data water unit log
  if (oldWaterUnit) {
    await prisma.waterLog.update({
      where: {
        id: oldWaterUnit.id
      },
      data: {
        waterUnit: waterUnit
      }
    })
  } else {
    await prisma.waterLog.create({
      data: {
        bookingId: bookingId,
        waterUnit: waterUnit
      }
    })
  }

   // update or create data electricity unit log
  if (oldElectricityUnit) {
    await prisma.electricityLog.update({
      where: {
        id: oldElectricityUnit.id
      },
      data: {
        electricityUnit: electricityUnit
      }
    })
  } else {
    await prisma.electricityLog.create({
      data: {
        bookingId: bookingId,
        electricityUnit: electricityUnit
      }
    })
  }
  

}