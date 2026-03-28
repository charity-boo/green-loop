/**
 * Utility to process images for Transformers.js
 * Transformers.js pipelines generally accept image URLs directly, 
 * so this utility simply converts a Blob to an Object URL.
 */
export const imageToTensor = async (image: Blob): Promise<string> => {
  try {
    return URL.createObjectURL(image);
  } catch (error) {
    console.error('Failed to convert image to URL:', error);
    throw new Error('Image processing failed.');
  }
};
