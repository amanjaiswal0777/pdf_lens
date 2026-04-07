import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const dbName = process.env.MONGODB_DB || "pdflens";

  if (!mongoUri) {
    console.log("MongoDB URI is not set; skipping MongoDB connection.");
    return;
  }

  try {
    await mongoose.connect(mongoUri, { dbName });
    console.log(`MongoDB Connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
