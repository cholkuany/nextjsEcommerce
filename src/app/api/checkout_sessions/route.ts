// import { stripe } from "@/app/lib/stripe";
// import { NextRequest, NextResponse } from "next/server";

import { StripeProduct } from "@/types";

// // Get all active products from Stripe
// const getActiveStripeProducts = async () => {
//   const products = await stripe.products.list({ active: true, limit: 100 });
//   return products.data;
// };

// // Get or create a product and return its price ID
// const getOrCreateStripeProduct = async (item: StripeProduct) => {
//   const activeProducts = await getActiveStripeProducts();

//   const existingProduct = activeProducts.find((p) => p.name === item.name);

//   if (existingProduct && existingProduct.default_price) {
//     return existingProduct.default_price as string;
//   }

//   // Create a new product with a price
//   const newProduct = await stripe.products.create({
//     name: item.name,
//     description: item.description,
//     images: item.images,
//   });

//   const price = await stripe.prices.create({
//     product: newProduct.id,
//     unit_amount: item.price * 100, // Convert to cents
//     currency: "usd",
//   });

//   // Optionally update product with default price
//   await stripe.products.update(newProduct.id, {
//     default_price: price.id,
//   });

//   return price.id;
// };

// // POST handler
// export async function POST(req: NextRequest) {
//   try {
//     const { items }: { items: StripeProduct[] } = await req.json();

//     const lineItems = [];

//     for (const item of items) {
//       const priceId = await getOrCreateStripeProduct(item);
//       lineItems.push({
//         price: priceId,
//         quantity: item.quantity,
//       });
//     }

//     // Create a checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: lineItems,
//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
//     });

//     return NextResponse.json({ url: session.id });
//   } catch (error) {
//     console.error("Checkout error:", error);
//     return NextResponse.json(
//       { error: "An error occurred during checkout" },
//       { status: 500 }
//     );
//   }
// }

// GOOD WORKING CODE---UNCOMMENT LATER
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const { items } = await req.json();

  const line_items = items.map((item: StripeProduct) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        description: item.description,
        images: item.images,
      },
      unit_amount: item.price * 100, // convert dollars to cents
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      // metadata: {
      //   userId: "user_123",
      //   cartId: "cart_456",
      // },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error.message);
    return new NextResponse("Stripe Checkout Session failed", { status: 500 });
  }
}
