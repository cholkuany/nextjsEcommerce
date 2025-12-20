// components/DiscountForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { discountSchema } from "@/zodSchemas/formSchema";
import { z } from "zod";

type DiscountFormValues = z.infer<typeof discountSchema>;

export default function DiscountForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      isActive: false,
    },
  });

  const isActive = watch("isActive");

  const onSubmit = async (data: DiscountFormValues) => {
    const res = await fetch("/api/discounts", {
      method: "POST",
      body: JSON.stringify({ discount: data }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      alert("Something went wrong");
    } else {
      alert("Discount submitted!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label>
        <input type="checkbox" {...register("isActive")} />
        Active
      </label>

      {isActive && (
        <>
          <div>
            <label>Type:</label>
            <select {...register("type")}>
              <option value="">Select</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
            {errors.type && <p>{errors.type.message}</p>}
          </div>

          <div>
            <label>Value:</label>
            <input type="number" step="0.01" {...register("value")} />
            {errors.value && <p>{errors.value.message}</p>}
          </div>

          <div>
            <label>Start Date:</label>
            <input
              type="date"
              {...register("startDate", { valueAsDate: true })}
            />
            {errors.startDate && <p>{errors.startDate.message}</p>}
          </div>

          <div>
            <label>End Date:</label>
            <input
              type="date"
              {...register("endDate", { valueAsDate: true })}
            />
            {errors.endDate && <p>{errors.endDate.message}</p>}
          </div>

          <div>
            <label>Max Discount Amount:</label>
            <input
              type="number"
              step="0.01"
              {...register("maxDiscountAmount")}
            />
            {errors.maxDiscountAmount && (
              <p>{errors.maxDiscountAmount.message}</p>
            )}
          </div>
        </>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}
