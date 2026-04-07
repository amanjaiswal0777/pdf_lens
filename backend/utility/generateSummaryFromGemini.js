import { extractJsonResponse } from "./extractJsonResponse.js";

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

export { generateSummaryFromGemini };
