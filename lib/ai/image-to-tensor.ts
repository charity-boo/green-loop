import * as tf from '@tensorflow/tfjs';

/**
 * Converts a web Blob/File object to a TensorFlow.js tensor.
 *
 * @param image - The image Blob or File.
 * @returns A pre-processed tensor ready for the model.
 */
export const imageToTensor = async (image: Blob): Promise<tf.Tensor> => {
  try {
    const imageElement = new Image();
    imageElement.src = URL.createObjectURL(image);
    await new Promise((resolve, reject) => {
      imageElement.onload = resolve;
      imageElement.onerror = reject;
    });

    const tensor = tf.browser
      .fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224]) // Adjust to your model's expected input size
      .toFloat()
      .expandDims();

    URL.revokeObjectURL(imageElement.src); // Clean up the object URL
    return tensor;
  } catch (error) {
    console.error('Failed to convert image to tensor:', error);
    throw new Error('Image processing failed.');
  }
};
