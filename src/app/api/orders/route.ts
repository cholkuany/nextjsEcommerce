import dbConnect from "@/app/lib/mongodbConnection";
import Order from "@/models/order";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // const session = await getServerSession(authOptions);
  // if (!session)
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  await dbConnect();

  const order = await Order.create({
    // user: session.user.id,
    items: data.items,
    total: data.total,
    shippingAddress: data.shippingAddress,
    status: "paid",
  });

  return NextResponse.json(order);
}
