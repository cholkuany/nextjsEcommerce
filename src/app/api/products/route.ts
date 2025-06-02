import dbConnect from "@/app/lib/mongodbConnection";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const products = await Product.find({});
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const product = await Product.create(data);
  return NextResponse.json(product);
}
