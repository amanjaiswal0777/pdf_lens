export function extractJsonResponse(rawText) {
  const cleaned = rawText.replace(/```json|```/gi, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Model did not return valid JSON.");
    }

    return JSON.parse(jsonMatch[0]);
  }
}

