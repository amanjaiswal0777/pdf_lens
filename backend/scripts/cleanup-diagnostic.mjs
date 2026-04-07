import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(backendDir, ".env") });

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
const dbName = process.env.MONGODB_DB || "pdflens";

await mongoose.connect(mongoUri, { dbName });
const result = await User.deleteMany({
  email: { $regex: /^(diag|route)_\d+@example\.com$/ },
});
console.log(`deleted ${result.deletedCount} temporary users`);
await mongoose.disconnect();
