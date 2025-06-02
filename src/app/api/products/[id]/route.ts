import dbConnect from "@/app/lib/mongodbConnection";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const data = await req.json();
  const updated = await Product.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return NextResponse.json(updated);
}
