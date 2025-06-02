import { NextRequest } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/app/lib/stripe";
import Order from "@/models/order";

export async function POST(req: NextRequest) {
  const body = await req.text(); // raw body for signature verification
  const sig = req.headers.get("stripe-signature"); // ✅ use headers from req

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      // ✅ Create your order in DB
      // await Order.create({
      //   userId: session.metadata.userId,
      //   cartId: session.metadata.cartId,
      //   sessionId: session.id,
      //   totalAmount: session.amount_total,
      //   items: lineItems.data,
      //   status: "paid",
      // });

      console.log("✅ Order saved to MongoDB");
    } catch (err) {
      console.error("DB Save Error:", err);
      return new Response("Database error", { status: 500 });
    }
    console.log("✅ Payment succeeded:", session);
  }

  return new Response("Webhook received", { status: 200 });
}
