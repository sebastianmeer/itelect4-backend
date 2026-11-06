import mongoose from "mongoose";

let connection: Promise<typeof mongoose> | undefined;

export function connectDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required for database-backed routes.");
  connection ??= mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  return connection;
}
