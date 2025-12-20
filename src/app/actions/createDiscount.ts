// actions/createDiscount.ts

"use server";

import { discountSchema } from "@/zodSchemas/formSchema";

export async function createDiscount(data: unknown) {
  const parsed = discountSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const discount = parsed.data;
  console.log("Creating discount:", discount);

  // Store discount in DB (e.g., Prisma)
  // await db.discount.create({ data: discount });

  return { success: true };
}
