// models/Revenue.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IRevenueBreakdown {
  productSales: number;
  shipping: number;
  tax: number;
  discounts: number;
  refunds: number;
  fees: number;
}

const RevenueSchema = new Schema(
  {
    // Time period
    date: {
      type: Date,
      required: true,
      index: true,
    },
    period: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
      index: true,
    },

    // Revenue breakdown
    breakdown: {
      productSales: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      discounts: { type: Number, default: 0 },
      refunds: { type: Number, default: 0 },
      fees: { type: Number, default: 0 },
    },

    // Totals
    grossRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    netRevenue: {
      type: Number,
      required: true,
      default: 0,
    },

    // Order metrics
    orderMetrics: {
      totalOrders: { type: Number, default: 0 },
      averageOrderValue: { type: Number, default: 0 },
      newCustomers: { type: Number, default: 0 },
      returningCustomers: { type: Number, default: 0 },
    },

    // Product performance
    topProducts: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        revenue: Number,
        quantity: Number,
      },
    ],

    // Category performance
    categoryBreakdown: [
      {
        category: { type: Schema.Types.ObjectId, ref: "Category" },
        revenue: Number,
        orders: Number,
      },
    ],

    // Geographic data
    geographic: [
      {
        region: String,
        revenue: Number,
        orders: Number,
      },
    ],

    // Channel attribution
    channels: [
      {
        name: String, // 'organic', 'paid', 'email', 'social'
        revenue: Number,
        orders: Number,
        customers: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound unique index
RevenueSchema.index({ date: 1, period: 1 }, { unique: true });
RevenueSchema.index({ period: 1, date: -1 });

export type RevenueDocument = mongoose.InferSchemaType<typeof RevenueSchema>;

const Revenue =
  models.Revenue || model<RevenueDocument>("Revenue", RevenueSchema);

export default Revenue;
