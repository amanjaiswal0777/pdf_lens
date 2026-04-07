import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateSummaryFromGemini } from "../utility/generateSummaryFromGemini.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const getGeminiApiKey = () => process.env.GEMINI_API_KEY?.trim() || "";
const getGeminiClient = () => new GoogleGenerativeAI(getGeminiApiKey());

export const getGeminiDebugInfo = (req, res) => {
  const rawKey = process.env.GEMINI_API_KEY ?? "";
  const trimmedKey = getGeminiApiKey();

  return res.json({
    hasKey: Boolean(rawKey),
    sameAfterTrim: rawKey === trimmedKey,
    rawLength: rawKey.length,
    trimmedLength: trimmedKey.length,
    prefix: trimmedKey ? `${trimmedKey.slice(0, 8)}...` : null,
    model: GEMINI_MODEL,
  });
};

export const uploadPDF = async (req, res) => {
  const apiKey = getGeminiApiKey();

  try {
    if (!apiKey) {
      return res.status(500).json({
        error: "Missing GEMINI_API_KEY in backend .env",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text.trim().slice(0, 15000);
    const genAI = getGeminiClient();

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
    });

    const textPrompt = `
    Summarize the following text and generate 5 to 15 keywords.

    Respond ONLY in valid JSON format:
    {
      "summary": "string",
      "keywords": ["keyword1", "keyword2"]
    }

    Text:
    ${text}
    `;

    const pdfPrompt = `
    Analyze the attached PDF and generate a summary with 5 to 15 keywords.

    Respond ONLY in valid JSON format:
    {
      "summary": "string",
      "keywords": ["keyword1", "keyword2"]
    }
    `;

    const parsed = text
      ? await generateSummaryFromGemini(model, textPrompt)
      : await generateSummaryFromGemini(model, pdfPrompt, req.file.buffer);

    return res.json(parsed);
  } catch (error) {
    console.error(error);

    const message = error?.message || "";
    const isInvalidGeminiKey =
      message.includes("API key not valid") || message.includes("API_KEY_INVALID");

    if (isInvalidGeminiKey) {
      console.log("Gemini key debug:", {
        hasKey: Boolean(process.env.GEMINI_API_KEY),
        sameAfterTrim: process.env.GEMINI_API_KEY === apiKey,
        rawLength: process.env.GEMINI_API_KEY?.length ?? 0,
        trimmedLength: apiKey.length,
        prefix: apiKey ? `${apiKey.slice(0, 8)}...` : null,
        model: GEMINI_MODEL,
      });

      return res.status(500).json({
        error: "Invalid GEMINI_API_KEY. Update the key in backend/.env and restart the backend server.",
      });
    }

    return res.status(500).json({
      error: "AI processing failed",
    });
  }
};
