// import mongoose from "mongoose";

// const CartItemSchema = new mongoose.Schema({
//   product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//   quantity: Number,
// });

// const CartSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
//     items: [CartItemSchema],
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);

// models/Cart.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  variant?: {
    size?: string;
    color?: string;
    style?: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedAt: Date;
  lastUpdated: Date;
}

export interface ICartPricing {
  subtotal: number;
  tax: number;
  taxRate: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface IAppliedCoupons {
  code: string;
  discountType: "percentage" | "fixed" | "free_shipping";
  discountValue: number;
  discountAmount: number;
  appliedAt: Date;
}

export interface CartMethods {
  calculatePricing(): Promise<void>;
  addItem(
    productId: string,
    quantity?: number,
    variant?: any,
    unitPrice?: number
  ): Promise<any>;
  removeItem(productId: string, variant?: any): Promise<any>;
  updateQuantity(
    productId: string,
    quantity: number,
    variant?: any
  ): Promise<any>;
  clearCart(): Promise<any>;
  applyCoupon(
    couponCode: string,
    discountType: string,
    discountValue: number,
    discountAmount: number
  ): Promise<any>;
  removeCoupon(couponCode: string): Promise<any>;
  moveToSaved(productId: string, variant?: any): Promise<any>;
  convertToOrder(orderId: string): Promise<any>;
}

const AppliedCouponsSchema = new Schema<IAppliedCoupons>({
  code: { type: String, required: true },
  discountType: {
    type: String,
    enum: ["percentage", "fixed", "free_shipping"],
  },
  discountValue: Number,
  discountAmount: Number,
  appliedAt: { type: Date, default: Date.now },
});

const CartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
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
    max: 99,
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
  addedAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const CartPricingSchema = new Schema<ICartPricing>({
  subtotal: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  taxRate: { type: Number, default: 0, min: 0, max: 1 },
  shipping: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, default: 0, min: 0 },
});

const CartSchema = new Schema(
  {
    // User identification
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
      sparse: true,
    }, // For guest users

    // Cart items
    items: {
      type: [CartItemSchema],
      default: [],
      validate: {
        validator: function (items: ICartItem[]) {
          return items.length <= 50; // Max 50 items per cart
        },
        message: "Cart cannot exceed 50 items",
      },
    },

    // Pricing
    pricing: {
      type: CartPricingSchema,
      default: () => ({}),
    },

    // Discounts and coupons
    appliedCoupons: [AppliedCouponsSchema],

    // Shipping information
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    shippingMethod: {
      method: String,
      cost: { type: Number, default: 0 },
      estimatedDelivery: Date,
    },

    // Cart lifecycle
    status: {
      type: String,
      enum: ["active", "abandoned", "converted", "expired"],
      default: "active",
      index: true,
    },

    // Expiration
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index
    },

    // Analytics and tracking
    analytics: {
      abandonedAt: Date,
      recoveryEmailSent: { type: Boolean, default: false },
      recoveryEmailSentAt: Date,
      source: {
        page: String,
        referrer: String,
        campaign: String,
      },
      deviceInfo: {
        userAgent: String,
        platform: String,
        browser: String,
      },
    },

    // Saved for later / Wishlist integration
    savedItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        variant: {
          size: String,
          color: String,
          style: String,
        },
        savedAt: { type: Date, default: Date.now },
        movedFromCart: { type: Boolean, default: false },
      },
    ],

    // Conversion tracking
    convertedToOrder: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    convertedAt: Date,

    // Notes
    notes: {
      customer: String,
      internal: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
CartSchema.index({ user: 1, status: 1 });
CartSchema.index({ sessionId: 1, status: 1 });
CartSchema.index({ updatedAt: -1 });
CartSchema.index({ status: 1, updatedAt: -1 });
CartSchema.index({ expiresAt: 1 }); // TTL index

// Ensure only one active cart per user
CartSchema.index(
  { user: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      user: { $exists: true },
      status: "active",
    },
  }
);

// Virtuals
CartSchema.virtual("itemCount").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

CartSchema.virtual("uniqueItemCount").get(function () {
  return this.items.length;
});

CartSchema.virtual("isEmpty").get(function () {
  return this.items.length === 0;
});

CartSchema.virtual("isAbandoned").get(function () {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.updatedAt < oneDayAgo && this.status === "active";
});

// Pre-save middleware
CartSchema.pre<CartDocument>("save", async function (next) {
  // Update item total prices
  this.items.forEach((item) => {
    item.totalPrice = item.unitPrice * item.quantity;
    if (this.isModified(`items.${this.items.indexOf(item)}.quantity`)) {
      item.lastUpdated = new Date();
    }
  });

  // Calculate pricing
  await this.calculatePricing();

  // Mark as abandoned if criteria met
  if (this.get("isAbandoned") && this.status === "active") {
    this.status = "abandoned";
    if (this.analytics) {
      this.analytics.abandonedAt = new Date();
    }
  }

  // Extend expiration if cart is updated
  if (this.isModified("items") && this.status === "active") {
    this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  next();
});

// Methods
CartSchema.methods.addItem = function (
  productId: string,
  quantity: number = 1,
  variant?: any,
  unitPrice?: number
) {
  const existingItemIndex = this.items.findIndex(
    (item: ICartItem) =>
      item.product.toString() === productId &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].lastUpdated = new Date();
  } else {
    // Add new item
    this.items.push({
      product: new mongoose.Types.ObjectId(productId),
      variant,
      quantity,
      unitPrice: unitPrice || 0,
      totalPrice: (unitPrice || 0) * quantity,
      addedAt: new Date(),
      lastUpdated: new Date(),
    });
  }

  this.status = "active";
  return this.save();
};

CartSchema.methods.removeItem = function (productId: string, variant?: any) {
  this.items = this.items.filter(
    (item: ICartItem) =>
      !(
        item.product.toString() === productId &&
        JSON.stringify(item.variant) === JSON.stringify(variant)
      )
  );

  return this.save();
};

CartSchema.methods.updateQuantity = function (
  productId: string,
  quantity: number,
  variant?: any
) {
  const itemIndex = this.items.findIndex(
    (item: ICartItem) =>
      item.product.toString() === productId &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (itemIndex > -1) {
    if (quantity <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
      this.items[itemIndex].lastUpdated = new Date();
    }
  }

  return this.save();
};

CartSchema.methods.clearCart = function () {
  this.items = [];
  this.appliedCoupons = [];
  this.pricing = {
    subtotal: 0,
    tax: 0,
    taxRate: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  };

  return this.save();
};

CartSchema.methods.applyCoupon = function (
  couponCode: string,
  discountType: string,
  discountValue: number,
  discountAmount: number
) {
  // Remove existing coupon if any
  this.appliedCoupons = this.appliedCoupons.filter(
    (coupon: IAppliedCoupons) => coupon.code !== couponCode
  );

  // let discountAmount = 0;

  // if (coupon.type === "percentage") {
  //   // Calculate percentage discount
  //   discountAmount = (this.pricing.subtotal * coupon.value) / 100;

  //   // Apply maximum cap if exists
  //   if (coupon.maxAmount && discountAmount > coupon.maxAmount) {
  //     discountAmount = coupon.maxAmount;
  //   }
  // } else if (coupon.type === "fixed") {
  //   // Fixed discount - amount is same as value
  //   discountAmount = Math.min(coupon.value, this.pricing.subtotal);
  // }

  // Add new coupon
  this.appliedCoupons.push({
    code: couponCode,
    discountType,
    discountValue, // Original coupon setting
    discountAmount, // Calculated dollar savings
    appliedAt: new Date(),
  });

  return this.save();
};

CartSchema.methods.removeCoupon = function (couponCode: string) {
  this.appliedCoupons = this.appliedCoupons.filter(
    (coupon: IAppliedCoupons) => coupon.code !== couponCode
  );
  return this.save();
};

CartSchema.methods.calculatePricing = async function (): Promise<void> {
  // Calculate subtotal
  const subtotal = this.items.reduce(
    (total: number, item: ICartItem) => total + item.totalPrice,
    0
  );

  // Calculate discount from coupons
  let totalDiscount = 0;
  this.appliedCoupons.forEach((coupon: IAppliedCoupons) => {
    totalDiscount += coupon.discountAmount || 0;
  });

  // Calculate tax (this would typically integrate with a tax service)
  const taxRate = this.pricing.taxRate || 0;
  const tax = (subtotal - totalDiscount) * taxRate;

  // Get shipping cost
  const shipping = this.shippingMethod?.cost || 0;

  // Calculate total
  const total = Math.max(0, subtotal - totalDiscount + tax + shipping);

  // Update pricing
  this.pricing = {
    subtotal,
    tax,
    taxRate,
    shipping,
    discount: totalDiscount,
    total,
  };
};

CartSchema.methods.moveToSaved = function (productId: string, variant?: any) {
  const itemIndex = this.items.findIndex(
    (item: ICartItem) =>
      item.product.toString() === productId &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (itemIndex > -1) {
    const item = this.items[itemIndex];

    // Add to saved items
    this.savedItems.push({
      product: item.product,
      variant: item.variant,
      savedAt: new Date(),
      movedFromCart: true,
    });

    // Remove from cart
    this.items.splice(itemIndex, 1);
  }

  return this.save();
};

CartSchema.methods.convertToOrder = function (orderId: string) {
  this.status = "converted";
  this.convertedToOrder = new mongoose.Types.ObjectId(orderId);
  this.convertedAt = new Date();

  return this.save();
};

// Static methods
CartSchema.statics.findByUserOrSession = function (
  userId?: string,
  sessionId?: string
) {
  const query: any = { status: "active" };

  if (userId) {
    query.user = userId;
  } else if (sessionId) {
    query.sessionId = sessionId;
  } else {
    return null;
  }

  return this.findOne(query).populate(
    "items.product",
    "name price images inventory"
  );
};

CartSchema.statics.getAbandonedCarts = function (hours: number = 24) {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

  return this.find({
    status: "active",
    updatedAt: { $lt: cutoffTime },
    "items.0": { $exists: true }, // Has items
    "analytics.recoveryEmailSent": false,
  }).populate("user", "name email");
};

export type CartType = mongoose.InferSchemaType<typeof CartSchema>;
export type CartDocument = mongoose.HydratedDocument<CartType, CartMethods>;

const Cart =
  (models.Cart as mongoose.Model<CartDocument>) ||
  model<CartDocument>("Cart", CartSchema);

export default Cart;
