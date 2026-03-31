import fetch from "node-fetch";

export const analyzeFeedback = async (title: string, description: string) => {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY");
      return null;
    }

    const prompt = `
Analyse this product feedback.

Return ONLY valid JSON:
{
  "category": "...",
  "sentiment": "...",
  "priority_score": 1-10,
  "summary": "...",
  "tags": ["..."]
}

Title: ${title}
Description: ${description}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data: any = await response.json();

    //console.log("Gemini raw:", JSON.stringify(data, null, 2));

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Gemini returned no text:", data);
      return null;
    }

    // Clean possible markdown wrapping
    const cleaned = text.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parse failed:", cleaned);
      return null;
    }
  } catch (error) {
    console.error("Gemini error:", error);
    return null;
  }
};