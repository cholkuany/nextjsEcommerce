import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
  },
  { _id: false }
);

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  price: Number,
});

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [OrderItemSchema],
    customerEmail: { type: String, required: false },
    shippingAddress: { type: AddressSchema, required: false },
    total: Number,
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
