import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ClassificationResult {
  wasteType: string;
  disposalTips: string;
  confidence: number;
}

/**
 * Classifies waste using Gemini AI based on an image URL.
 */
export async function classifyWaste(imageUrl: string): Promise<ClassificationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash-latest" 
  });

  try {
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const mimeType = (imageResponse.headers.get("content-type") || "image/jpeg") as string;

    const prompt = `Analyze this image of waste or garbage. Return ONLY valid JSON with no markdown, no code blocks:
{
  "wasteType": "<concise label for the type of waste visible>",
  "disposalTips": "<2-3 sentence guidance on how to handle or dispose of this waste safely and responsibly>",
  "confidence": <number between 0.0 and 1.0>
}`;

    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType } },
      prompt,
    ]);

    const text = result.response.text().trim();
    // Strip markdown if it exists
    const jsonStr = text.replace(/```json\n?|```/g, "").trim();
    
    const parsed = JSON.parse(jsonStr) as ClassificationResult;
    
    if (!parsed.wasteType || !parsed.disposalTips) {
      throw new Error("Missing required fields in Gemini response");
    }

    // Default confidence if missing
    if (parsed.confidence === undefined) {
      parsed.confidence = 0.9;
    }
    
    return parsed;
  } catch (error) {
    console.error("Error in Gemini classification:", error);
    throw error;
  }
}
