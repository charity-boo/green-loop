import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads an image to Firebase Storage (React Native version).
 *
 * @param imageUri - The local file URI of the image.
 * @param userId - The ID of the user uploading the image.
 * @param progressCallback - An optional callback to report upload progress (0 to 1).
 * @returns The public URL of the uploaded image.
 */
export const uploadImageAndGetURL = async (
  imageUri: string,
  userId: string,
  progressCallback?: (progress: number) => void
): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `waste-images/${userId}/${new Date().toISOString()}`);

  try {
    // Convert the local file path to a blob
    const response = await new Promise<XMLHttpRequest>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr);
      xhr.onerror = () => reject(new TypeError('Network request failed'));
      xhr.responseType = 'blob';
      xhr.open('GET', imageUri, true);
      xhr.send(null);
    });
    const blob = response.response as Blob;

    // Note: Using uploadBytes for simplicity. For a detailed progress bar,
    // you would use uploadBytesResumable and listen to 'state_changed' events.
    await uploadBytes(storageRef, blob);
    progressCallback?.(1); // Mark as complete

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image.');
  }
};
