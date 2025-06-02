import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/product";
import dbConnect from "@/app/lib/mongodbConnection";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  console.log("body", body);
  // Save to DB
  if (!body) {
    return NextResponse.json({ message: "No data provided" }, { status: 400 });
  }
  const product = await Product.create(body);
  if (!product) {
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
  return NextResponse.json(product, { status: 201 });
}
