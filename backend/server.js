const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());

const upload = multer();
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

function extractJsonResponse(rawText) {
  const cleaned = rawText.replace(/```json|```/gi, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Model did not return valid JSON.");
    }

    return JSON.parse(jsonMatch[0]);
  }
}

async function generateSummaryFromGemini(model, prompt, pdfBuffer) {
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: pdfBuffer
          ? [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: pdfBuffer.toString("base64"),
                },
              },
              { text: prompt },
            ]
          : [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const response = await result.response.text();
  const parsed = extractJsonResponse(response);

  if (!parsed.summary || !Array.isArray(parsed.keywords)) {
    throw new Error("Model response is missing summary or keywords.");
  }

  return parsed;
}

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY in backend .env" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text.trim().slice(0, 15000);

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

    res.json(parsed);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "AI processing failed",
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
