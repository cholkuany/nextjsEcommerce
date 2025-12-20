// models/Address.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IAddress {
  type: "billing" | "shipping" | "both";
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  instructions?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const AddressSchema = new Schema<IAddress>(
  {
    type: {
      type: String,
      enum: ["billing", "shipping", "both"],
      default: "both",
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    addressLine2: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: "United States",
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    coordinates: {
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 },
    },
  },
  { _id: false }
);

// Virtual for full address string
AddressSchema.virtual("fullAddress").get(function () {
  const parts = [
    this.addressLine1,
    this.addressLine2,
    this.city,
    this.state,
    this.postalCode,
    this.country,
  ].filter(Boolean);

  return parts.join(", ");
});

AddressSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

export type AddressDocument = mongoose.InferSchemaType<typeof AddressSchema>;
export default AddressSchema;
