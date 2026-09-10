import mongoose from "mongoose";

function getMongoURI(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  return uri;
}

const MONGODB_URI = getMongoURI();

let connection: typeof mongoose | null = null;

export async function connectDB() {
  if (connection) {
    return connection;
  }

  connection = await mongoose.connect(MONGODB_URI);

  return connection;
}
