import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (mongoUri) {
    await connectDB();
  } else {
    console.log("MongoDB URI is not configured; set MONGODB_URI or MONGO_URI.");
  }

  app.listen(PORT, () => {
    console.log(`Server running on Port:${PORT}`);
  });
};

startServer();
