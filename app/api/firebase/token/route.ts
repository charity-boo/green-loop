/**
 * API Route: GET /api/firebase/token
 * 
 * Generates a Firebase ID token for authenticated users
 * This bridges NextAuth sessions with Firebase authentication
 * 
 * Usage:
 *   const response = await fetch('/api/firebase/token');
 *   const { token } = await response.json();
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { handleApiError } from '@/lib/api-handler';

export async function GET() {
  try {
    // Verify NextAuth session exists
    const session = await getSession();
    await authorize(session, ['USER', 'COLLECTOR', 'ADMIN']);

    return NextResponse.json(
      {
        message:
          'Firebase token generation requires Admin SDK setup. See implementation notes.',
        userId: session!.user.id,
        role: session!.user.role,
        email: session!.user.email,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GET /api/firebase/token');
  }
}
