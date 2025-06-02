import mongoose, { Schema, Document, models, model, Model } from "mongoose";

export interface UserType extends Document {
  name?: string;
  image?: string;
  emailVerified?: { type: Date };
  email: { type: String; unique: true };
  role: { type: String; enum: ["user", "admin"]; default: "user" };
}
const UserSchema = new Schema<UserType>(
  {
    name: String,
    email: { type: String, unique: true },
    image: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    emailVerified: { type: Date },
  },
  { timestamps: true }
);

const User: Model<UserType> =
  models.User || model<UserType>("User", UserSchema);

export default User;
