// import { stripe } from "@/lib/stripe";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const { cartItems } = await req.json();

//   const lineItems = cartItems.map((item) => ({
//     price_data: {
//       currency: "usd",
//       product_data: {
//         name: item.name,
//       },
//       unit_amount: item.price * 100,
//     },
//     quantity: item.quantity,
//   }));

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: lineItems,
//     mode: "payment",
//     success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
//     cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
//   });

//   return NextResponse.json({ url: session.url });
// }
