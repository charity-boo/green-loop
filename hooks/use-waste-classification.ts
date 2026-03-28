import { useState, useCallback } from 'react';
import { ClassificationResult } from '../lib/ai/gemini';
import { uploadImageAndGetURL } from '../lib/storage/image-service';
import { addNotification } from '../lib/firebase/notifications';
import { AppUser } from '@/types';

interface WasteClassificationState {
  loading: boolean;
  error: Error | null;
  result: ClassificationResult | null;
  progress: {
    status: string;
    value: number; // 0 to 1
  };
}

/**
 * A hook to manage the entire waste classification process, from upload to notification.
 * Uses the Gemini Vision API via the server-side /api/waste/classify route.
 * @param user - The user object, containing id and role.
 */
export const useWasteClassification = (user: Pick<AppUser, 'id' | 'role'>) => {
  const [state, setState] = useState<WasteClassificationState>({
    loading: false,
    error: null,
    result: null,
    progress: { status: 'idle', value: 0 },
  });

  const classifyImage = useCallback(
    async (image: Blob | string) => {
      if (!user?.id || !user?.role) {
        setState((s) => ({ ...s, error: new Error('User is not authenticated.'), loading: false }));
        return;
      }

      setState({
        loading: true,
        error: null,
        result: null,
        progress: { status: 'starting', value: 0 },
      });

      try {
        // 1. Upload image and get a URL
        setState((s) => ({ ...s, progress: { status: 'uploading', value: 0 } }));
        // @ts-expect-error - We accept Blob or string, but the service is specific.
        const imageURL = await uploadImageAndGetURL(image, user.id, (p: number) => {
          setState((s) => ({ ...s, progress: { status: 'uploading', value: p } }));
        });

        // 2. Classify via Gemini API
        setState((s) => ({ ...s, progress: { status: 'classifying', value: 0.5 } }));
        const res = await fetch('/api/waste/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: imageURL }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error || 'AI classification failed');
        }
        const classificationResult: ClassificationResult = await res.json();
        setState((s) => ({ ...s, progress: { status: 'classifying', value: 1 } }));

        // 3. Send notification
        setState((s) => ({ ...s, progress: { status: 'notifying', value: 0.5 } }));
        await addNotification({
          userId: user.id,
          role: user.role as 'USER' | 'ADMIN' | 'COLLECTOR',
          title: 'AI Waste Suggestion',
          message: `We think your waste is '${classificationResult.wasteCategory}' with ${Math.round(classificationResult.probability * 100)}% confidence. Please confirm.`,
          type: 'AI-suggestion',
          status: 'unread',
        });

        // 4. Done
        setState({
          loading: false,
          error: null,
          result: classificationResult,
          progress: { status: 'completed', value: 1 },
        });
      } catch (err) {
        setState({
          loading: false,
          error: err as Error,
          result: null,
          progress: { status: 'error', value: 0 },
        });
      }
    },
    [user]
  );

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      result: null,
      progress: { status: 'idle', value: 0 },
    });
  }, []);

  return {
    ...state,
    classifyImage,
    reset,
  };
};