import { NextResponse } from "next/server";

import stripe from "@/app/lib/stripe";
import { CartItem } from "@/types";

export async function POST(req: Request) {
  const { items } = await req.json();

  const line_items = items.map((item: CartItem) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        description: item.description,
        images: item.variantImages,
        metadata: {
          variantSku: item.variantSku,
          variantOptions: JSON.stringify(item.variantOptions),
        }
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    if(error instanceof Error){
      console.error("Stripe error:", error.message);
    }else {
      console.error("Stripe error:", error)
    }
    return new NextResponse("Stripe Checkout Session failed", { status: 500 });
  }
}
