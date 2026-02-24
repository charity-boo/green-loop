import { useState, useCallback, useEffect } from 'react';
import {
  loadClassificationModel,
  classifyTensorAndNotify,
  ClassificationResult,
} from '../lib/ai/classification-service';
import { uploadImageAndGetURL } from '../lib/storage/image-service';
import { imageToTensor } from '../lib/ai/image-to-tensor';
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
 * It's designed to be cross-platform.
 * @param user - The user object, containing id and role.
 */
export const useWasteClassification = (user: Pick<AppUser, 'id' | 'role'>) => {
  const [state, setState] = useState<WasteClassificationState>({
    loading: false,
    error: null,
    result: null,
    progress: { status: 'idle', value: 0 },
  });

  // Pre-load the model when the hook is first used.
  useEffect(() => {
    setState((s) => ({ ...s, progress: { status: 'loading_model', value: 0 } }));
    loadClassificationModel((p) => {
      setState((s) => ({ ...s, progress: { status: 'loading_model', value: p } }));
    })
      .then(() => {
        setState((s) => ({ ...s, progress: { status: 'idle', value: 0 } }));
      })
      .catch((error) => {
        setState((s) => ({ ...s, error, loading: false }));
      });
  }, []);

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
        // 1. Upload image
        setState((s) => ({ ...s, progress: { status: 'uploading', value: 0 } }));
        // The bundler will pick the correct platform-specific version of the service.
        // For web, `image` is a Blob. For native, `image` is a URI string.
        // @ts-expect-error - We accept Blob or string, but the service is specific.
        const _imageURL = await uploadImageAndGetURL(image, user.id, (p) => {
          setState((s) => ({ ...s, progress: { status: 'uploading', value: p } }));
        });

        // 2. Convert to tensor
        setState((s) => ({ ...s, progress: { status: 'processing', value: 0 } }));
        // @ts-expect-error - imageToTensor accepts platform-specific input types
        const tensor = await imageToTensor(image);
        setState((s) => ({ ...s, progress: { status: 'processing', value: 1 } }));

        // 3. Classify and notify
        const classificationResult = await classifyTensorAndNotify(
          tensor,
          user.id,
          user.role as 'USER' | 'ADMIN' | 'COLLECTOR',
          (status, value) => {
            setState((s) => ({ ...s, progress: { status, value } }));
          }
        );

        // 4. Done
        setState({
          loading: false,
          error: null,
          result: classificationResult,
          progress: { status: 'completed', value: 1 },
        });

        tensor.dispose(); // Clean up tensor memory
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