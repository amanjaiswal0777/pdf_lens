import express from "express";
import multer from "multer";
import { uploadPDF } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", protect, upload.single("pdf"), uploadPDF);

export default router;
