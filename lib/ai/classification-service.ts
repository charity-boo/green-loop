import * as tf from '@tensorflow/tfjs';
import { addNotification } from '../firebase/notifications';

const MODEL_URL = '/model/model.json'; // This would be the path to your trained model
const LABELS_URL = '/model/labels.json'; // Path to your labels file

export interface ClassificationResult {
  className: string;
  probability: number;
}

let model: tf.LayersModel | null = null;
let labels: string[] | null = null;

// Helper to load the model and labels
export const loadClassificationModel = async (progressCallback?: (progress: number) => void) => {
  if (model && labels) {
    return;
  }
  try {
    const [loadedModel, loadedLabels] = await Promise.all([
      tf.loadLayersModel(MODEL_URL, { onProgress: progressCallback }),
      fetch(LABELS_URL).then((res) => res.json()),
    ]);
    model = loadedModel;
    labels = loadedLabels;
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load classification model.');
  }
};

/**
 * Classifies an image tensor and sends a notification.
 *
 * @param imageTensor - The pre-processed image tensor.
 * @param userId - The ID of the user.
 * @param userRole - The role of the user.
 * @param progressCallback - Optional callback for progress updates.
 * @returns The top classification result.
 */
export const classifyTensorAndNotify = async (
  imageTensor: tf.Tensor,
  userId: string,
  userRole: 'USER' | 'ADMIN' | 'COLLECTOR',
  progressCallback?: (status: string, progress: number) => void
): Promise<ClassificationResult> => {
  if (!model || !labels) {
    throw new Error('Classification model not loaded. Call loadClassificationModel first.');
  }

  try {
    // 1. Classify
    progressCallback?.('classifying', 0.5);
    const prediction = model.predict(imageTensor) as tf.Tensor;
    const scores = await prediction.data();
    prediction.dispose();
    progressCallback?.('classifying', 1);

    // 2. Get top result
    const topResultIndex = scores.indexOf(Math.max(...scores));
    const result: ClassificationResult = {
      className: labels[topResultIndex],
      probability: scores[topResultIndex],
    };

    // 3. Send notification
    progressCallback?.('notifying', 0.5);
    await addNotification({
      userId,
      role: userRole,
      title: 'AI Waste Suggestion',
      message: `We think your waste is '${result.className}' with ${Math.round(
        result.probability * 100
      )}% confidence. Please confirm.`,
      type: 'AI-suggestion',
      status: 'unread',
    });
    progressCallback?.('notifying', 1);

    return result;
  } catch (error) {
    console.error('Classification and notification process failed:', error);
    throw error; // Re-throw for the calling hook to handle
  }
};