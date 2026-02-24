import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js';

/**
 * Converts a React Native image URI to a TensorFlow.js tensor.
 *
 * @param imageUri - The local file URI of the image.
 * @returns A pre-processed tensor ready for the model.
 */
export const imageToTensor = async (imageUri: string): Promise<tf.Tensor> => {
  try {
    // 1. Fetch the image data
    const response = await fetch(imageUri, {}, { isBinary: true });
    const imageData = await response.arrayBuffer();

    // 2. Decode JPEG
    const { data, width, height } = jpeg.decode(imageData, { useTArray: true });

    // 3. Create tensor
    const imageTensor = tf.tensor3d(data, [height, width, 3]); // 3 for RGB

    // 4. Pre-process tensor
    const processedTensor = imageTensor
      .resizeNearestNeighbor([224, 224]) // Adjust to your model's expected input size
      .toFloat()
      .expandDims();

    // Dispose intermediate tensor
    imageTensor.dispose();

    return processedTensor;
  } catch (error) {
    console.error('Failed to convert image to tensor:', error);
    throw new Error('Image processing failed.');
  }
};
