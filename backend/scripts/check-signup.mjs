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
const email = `diag_${Date.now()}@example.com`;

if (!mongoUri) {
  throw new Error("Missing MONGODB_URI or MONGO_URI");
}

await mongoose.connect(mongoUri, { dbName });

console.log("connected_db", mongoose.connection.name);

const created = await User.create({
  name: "Diagnostic User",
  email,
  password: "hashed-password-placeholder",
});

console.log(
  JSON.stringify(
    {
      insertedId: created._id.toString(),
      email: created.email,
      collection: created.collection.name,
    },
    null,
    2
  )
);

await mongoose.disconnect();
