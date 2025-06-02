export async function GET(request: Request) {
  const res = await fetch("https://data.mongodb-api.com/...", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return Response.json({ data });
}

// import dbConnect from "@/lib/mongodb";
// import Cart from "@/models/Cart";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const session = await getServerSession(authOptions);
//   if (!session)
//     return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });

//   await dbConnect();
//   const cart = await Cart.findOne({ user: session.user.id }).populate(
//     "items.product"
//   );
//   return NextResponse.json(cart || { items: [] });
// }
