
import { adminDb } from '@/lib/firebase/admin';
import { AIClassificationResult } from '@/types';

/**
 * Logs an AI classification result to Firestore.
 */
export const logAIClassificationResult = async (
  data: Omit<AIClassificationResult, 'id' | 'createdAt'>
) => {
  try {
    const docRef = await adminDb.collection('aiResults').add({
      ...data,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error logging AI classification result:', error);
    throw new Error('Failed to log AI classification result.');
  }
};
