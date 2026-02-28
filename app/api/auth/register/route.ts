import { NextResponse } from 'next/server'
import { registerUser } from '@/lib/firebase/services/auth'
import { userRegistrationSchema } from '@/lib/validation/schemas'
import { createErrorResponse, createValidationErrorResponse } from '@/lib/api-response'
import { handleApiError } from '@/lib/api-handler'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validation = userRegistrationSchema.safeParse(body)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { name, email, password } = validation.data

    try {
      const user = await registerUser({ email, password, name });
      return NextResponse.json(user);
    } catch (firebaseError: unknown) {
      if (typeof firebaseError === 'object' && firebaseError !== null && 'code' in firebaseError && (firebaseError as { code: string }).code === 'auth/email-already-exists') {
        return createErrorResponse('Email already exists', undefined, 400);
      }
      throw firebaseError;
    }
  } catch (error) {
    return handleApiError(error, "POST /api/auth/register");
  }
}
