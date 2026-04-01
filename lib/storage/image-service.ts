import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

/**
 * Uploads an image to Firebase Storage (Web version).
 *
 * @param image - The image Blob or File.
 * @param userId - The ID of the user uploading the image.
 * @param progressCallback - An optional callback to report upload progress (0 to 1).
 * @returns The public URL of the uploaded image.
 */
export const uploadImageAndGetURL = async (
  image: Blob,
  userId: string,
  progressCallback?: (progress: number) => void,
  customPath?: string
): Promise<string> => {
  const storagePath = customPath || `waste-images/${userId}/${new Date().toISOString()}`;
  const storageRef = ref(storage, storagePath);

  try {
    // Note: Using uploadBytes for simplicity. For a detailed progress bar,
    // you would use uploadBytesResumable and listen to 'state_changed' events.
    await uploadBytes(storageRef, image);
    progressCallback?.(1); // Mark as complete

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image.');
  }
};