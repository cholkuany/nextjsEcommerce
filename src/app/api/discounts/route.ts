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

    console.log(parsed);

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

