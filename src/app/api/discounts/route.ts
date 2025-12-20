// app/api/discounts/route.ts

import { discountSchema } from "@/zodSchemas/formSchema";
import { z } from "zod";
import { NextResponse } from "next/server";

const requestSchema = z.object({
  discount: discountSchema,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestSchema.parse(body);

    // You can now safely use `parsed.discount` here
    // e.g., save to database

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", issues: err.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// export async function GET() {
//   await connectToDatabase();

//   const now = new Date();
//   const discounts = await Discount.find({
//     isActive: true,
//     endDate: { $gt: now },
//   }).sort({ createdAt: -1 });

//   return NextResponse.json(discounts);
// }

// // models/Discount.ts
// import mongoose from 'mongoose';
// import { z } from 'zod';
// import { discountSchema } from '@/schemas/discountSchema';
// import { zodToMongoose } from 'zod-to-mongoose';

// const DiscountMongooseSchema = new mongoose.Schema(
//   zodToMongoose(discountSchema),
//   { timestamps: true }
// );

// export const Discount =
//   mongoose.models.Discount ||
//   mongoose.model('Discount', DiscountMongooseSchema);
