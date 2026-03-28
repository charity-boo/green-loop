import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ClassificationResult {
  detectedItem: string;
  wasteCategory: string;
  formValue: 'organic' | 'plastic' | 'metal' | 'general' | 'mixed';
  probability: number;
  disposalTips: string;
  didYouKnow: string;
}

const PROMPT = `Analyze this image of waste or garbage. Return ONLY valid JSON with no markdown, no code blocks, just the raw JSON object:
{
  "detectedItem": "<specific item detected e.g. plastic bottle, banana peel, aluminium can>",
  "wasteCategory": "<display label, one of: Organic, Plastic, Metal, Mixed / Recyclable, General>",
  "formValue": "<exactly one of: organic | plastic | metal | general | mixed>",
  "probability": <confidence score between 0.0 and 1.0>,
  "disposalTips": "<2-3 sentence guidance on how to handle or dispose of this waste safely and responsibly>",
  "didYouKnow": "<one interesting environmental fact about this type of waste>"
}`;

export async function classifyWasteImage(imageUrl: string): Promise<ClassificationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest' });

  // Support both HTTP URLs and base64 data URLs
  let base64Image: string;
  let mimeType: string;

  if (imageUrl.startsWith('data:')) {
    const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) throw new Error('Invalid base64 data URL format');
    mimeType = match[1];
    base64Image = match[2];
  } else {
    // Fetch the image and convert to base64 for Gemini inline data
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    const imageBuffer = await imageResponse.arrayBuffer();
    base64Image = Buffer.from(imageBuffer).toString('base64');
    mimeType = (imageResponse.headers.get('content-type') || 'image/jpeg') as string;
  }

  const result = await model.generateContent([
    { inlineData: { data: base64Image, mimeType } },
    PROMPT,
  ]);

  const text = result.response.text().trim();

  try {
    const parsed = JSON.parse(text) as ClassificationResult;
    if (!parsed.detectedItem || !parsed.formValue || !parsed.disposalTips) {
      throw new Error('Missing required fields in Gemini response');
    }
    return parsed;
  } catch {
    throw new Error(`Failed to parse Gemini response: ${text}`);
  }
}
