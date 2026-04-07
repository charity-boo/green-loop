import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { classifyWasteImage } from '@/lib/ai/gemini';
import { createErrorResponse, createValidationErrorResponse } from '@/lib/api-response';
import { handleApiError } from '@/lib/api-handler';

const classifySchema = z.object({
  imageUrl: z
    .string()
    .min(1)
    .refine(
      (val) => val.startsWith('data:') || /^https?:\/\//.test(val),
      'imageUrl must be a valid URL or base64 data URL'
    ),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    await authorize(session, ['USER', 'COLLECTOR', 'ADMIN']);

    const body = await req.json();
    const validation = classifySchema.safeParse(body);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error);
    }

    const { imageUrl } = validation.data;

    try {
      const result = await classifyWasteImage(imageUrl);
      return NextResponse.json(result);
    } catch (aiError) {
      console.error('AI Classification API Error:', aiError);
      let message = aiError instanceof Error ? aiError.message : 'AI classification failed';

      // Improve quota error message
      if (message.includes('429') || message.toLowerCase().includes('quota')) {
        message = 'The AI service is currently at capacity. Please try again later or select your waste type manually.';
      }

      return createErrorResponse(message, undefined, 502);
    }
  } catch (error) {
    return handleApiError(error, 'POST /api/waste/classify');
  }
}
