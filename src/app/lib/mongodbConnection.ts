// src/lib/dbConnect.ts
import mongoose, { Mongoose } from "mongoose";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { Adapter } from "next-auth/adapters";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable.");
}

// Prevent TypeScript from complaining on re-run in dev
globalThis._mongoose ||= { conn: null, promise: null };

async function dbConnect(): Promise<Mongoose> {
  if (_mongoose.conn) return _mongoose.conn;

  if (!_mongoose.promise) {
    _mongoose.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
    });
  }

  _mongoose.conn = await _mongoose.promise;
  return _mongoose.conn;
}

export default dbConnect;

export async function getMongoAdapter(): Promise<Adapter> {
  const mongooseInstance = await dbConnect();
  return MongoDBAdapter(mongooseInstance.connection.getClient());
}
