import mongoose, { Schema, models, model } from "mongoose";
import AddressSchema from "./address";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  variant?: {
    size?: string;
    color?: string;
    style?: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    reason: string;
  };
  productSnapshot: {
    name: string;
    image: string;
    sku?: string;
  };
}

export interface IOrderShipping {
  method: string;
  carrier: string;
  cost: number;
  estimatedDelivery: Date;
  trackingNumber?: string;
  trackingUrl?: string;
}

export interface IOrderPayment {
  method: "credit_card" | "paypal" | "stripe" | "cash_on_delivery";
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paymentIntentId?: string;
  paidAt?: Date;
  amount: number;
  currency: string;
  gatewayResponse?: unknown;
}

export interface IOrderMethods {
  addStatusUpdate(
    status: string,
    note?: string,
    updatedBy?: string
  ): Promise<OrderDocument>;
}
export interface IOrderStaticMethods {
  getRevenueStats(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  }>;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },
  variant: {
    size: String,
    color: String,
    style: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: {
      type: String,
      enum: ["percentage", "fixed"],
    },
    value: {
      type: Number,
      min: 0,
    },
    reason: String,
  },
  productSnapshot: {
    name: { type: String, required: true },
    image: { type: String, required: true },
    sku: String,
  },
});

const OrderShippingSchema = new Schema<IOrderShipping>({
  method: {
    type: String,
    required: true,
    enum: ["standard", "express", "overnight", "pickup"],
  },
  carrier: {
    type: String,
    required: true,
    enum: ["UPS", "FedEx", "USPS", "DHL", "Local"],
  },
  cost: {
    type: Number,
    required: true,
    min: 0,
  },
  estimatedDelivery: {
    type: Date,
    required: true,
  },
  trackingNumber: String,
  trackingUrl: String,
});

const OrderPaymentSchema = new Schema<IOrderPayment>({
  method: {
    type: String,
    required: true,
    enum: ["credit_card", "paypal", "stripe", "cash_on_delivery"],
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "processing", "completed", "failed", "refunded"],
    default: "pending",
  },
  transactionId: String,
  paymentIntentId: String,
  paidAt: Date,
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: "USD",
  },
  gatewayResponse: Schema.Types.Mixed,
});

const OrderSchema = new Schema(
  {
    // Order Identification
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    // Customer Information
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    customerInfo: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      phone: String,
      isGuest: {
        type: Boolean,
        default: false,
      },
    },

    // Order Items
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function (items: IOrderItem[]) {
          return items.length > 0;
        },
        message: "Order must have at least one item",
      },
    },

    // Addresses
    shippingAddress: {
      type: AddressSchema,
      required: true,
    },
    billingAddress: {
      type: AddressSchema,
      required: true,
    },

    // Pricing
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      tax: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      taxRate: {
        type: Number,
        min: 0,
        max: 1,
        default: 0,
      },
      shipping: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      discount: {
        type: Number,
        min: 0,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    // Coupon/Discount
    coupon: {
      code: String,
      discountType: {
        type: String,
        enum: ["percentage", "fixed"],
      },
      discountValue: Number,
      discountAmount: Number,
    },

    // Order Status
    status: {
      type: String,
      enum: [
        "draft",
        "pending_payment",
        "payment_processing",
        "paid",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "refunded",
        "returned",
      ],
      default: "pending_payment",
      index: true,
    },

    // Shipping Information
    shipping: OrderShippingSchema,

    // Payment Information
    payment: OrderPaymentSchema,

    // Order Timeline
    timeline: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    // Notes and Communication
    notes: {
      customer: String,
      admin: String,
      internal: String,
    },

    // Fulfillment
    fulfillment: {
      warehouse: String,
      packedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      packedAt: Date,
      shippedAt: Date,
      deliveredAt: Date,
    },

    // Returns and Refunds
    returns: [
      {
        items: [
          {
            orderItem: Schema.Types.ObjectId,
            quantity: Number,
            reason: String,
          },
        ],
        status: {
          type: String,
          enum: ["requested", "approved", "rejected", "received", "processed"],
        },
        requestedAt: Date,
        processedAt: Date,
        refundAmount: Number,
      },
    ],

    // Marketing Attribution
    source: {
      channel: String, // 'organic', 'paid_search', 'email', 'social', etc.
      campaign: String,
      medium: String,
      referrer: String,
    },

    // Customer Service
    tickets: [
      {
        type: Schema.Types.ObjectId,
        ref: "SupportTicket",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
OrderSchema.index({ "customerInfo.email": 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ "payment.status": 1 });
OrderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
OrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.orderNumber = `ORD-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Methods
OrderSchema.methods.addStatusUpdate = function (
  status: string,
  note?: string,
  updatedBy?: string
) {
  this.timeline.push({
    status,
    timestamp: new Date(),
    note,
    updatedBy: updatedBy ? new mongoose.Types.ObjectId(updatedBy) : undefined,
  });

  this.status = status;
  return this.save();
};

// Static methods
OrderSchema.statics.getRevenueStats = async function (
  startDate: Date,
  endDate: Date
) {
  return await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ["paid", "processing", "shipped", "delivered"] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$pricing.total" },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: "$pricing.total" },
      },
    },
  ]);
};

export type OrderDocument = mongoose.HydratedDocument<
  mongoose.InferSchemaType<typeof OrderSchema>,
  IOrderMethods
>;

const Order =
  (models.Order as mongoose.Model<OrderDocument, IOrderStaticMethods>) ??
  model<OrderDocument, IOrderStaticMethods>("Order", OrderSchema);

export default Order;
