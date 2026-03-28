import { storage } from '@/lib/firebase/admin';
import { v4 as uuidv4 } from 'uuid';

export interface ImageUploadOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  generateThumbnail?: boolean;
}

export interface ImageUploadResult {
  url: string;
  path: string;
  thumbnailUrl?: string;
}

const DEFAULT_OPTIONS: ImageUploadOptions = {
  maxSizeInMB: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  generateThumbnail: false,
};

/**
 * Upload an image to Firebase Storage
 * @param file - File buffer or base64 string
 * @param contentType - Content type of the file (e.g., 'image/png')
 * @param folder - Storage folder path (e.g., 'green-tips', 'events')
 * @param options - Upload options
 * @returns Upload result with public URL
 */
export async function uploadImage(
  file: Buffer | string,
  contentType: string,
  folder: string,
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validate content type
  if (opts.allowedTypes && !opts.allowedTypes.includes(contentType)) {
    throw new Error(
      `Invalid file type: ${contentType}. Allowed types: ${opts.allowedTypes.join(', ')}`
    );
  }

  // Convert base64 to buffer if needed
  let buffer: Buffer;
  if (typeof file === 'string') {
    // Remove data URL prefix if present
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
    buffer = Buffer.from(base64Data, 'base64');
  } else {
    buffer = file;
  }

  // Validate size
  const sizeInMB = buffer.length / (1024 * 1024);
  if (opts.maxSizeInMB && sizeInMB > opts.maxSizeInMB) {
    throw new Error(
      `File size (${sizeInMB.toFixed(2)}MB) exceeds maximum allowed size (${opts.maxSizeInMB}MB)`
    );
  }

  // Generate unique filename
  const fileExtension = contentType.split('/')[1];
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `${folder}/${fileName}`;

  // Upload to Firebase Storage
  const bucket = storage.bucket();
  const fileRef = bucket.file(filePath);

  await fileRef.save(buffer, {
    metadata: {
      contentType,
    },
    public: true,
  });

  // Make the file publicly accessible
  await fileRef.makePublic();

  // Get public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

  return {
    url: publicUrl,
    path: filePath,
  };
}

/**
 * Delete an image from Firebase Storage
 * @param path - File path in storage (e.g., 'green-tips/abc123.png')
 */
export async function deleteImage(path: string): Promise<void> {
  try {
    const bucket = storage.bucket();
    const fileRef = bucket.file(path);
    await fileRef.delete();
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}

/**
 * Upload multiple images
 * @param files - Array of file buffers or base64 strings
 * @param contentTypes - Array of content types
 * @param folder - Storage folder path
 * @param options - Upload options
 * @returns Array of upload results
 */
export async function uploadMultipleImages(
  files: (Buffer | string)[],
  contentTypes: string[],
  folder: string,
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult[]> {
  if (files.length !== contentTypes.length) {
    throw new Error('Files and content types arrays must have the same length');
  }

  const uploadPromises = files.map((file, index) =>
    uploadImage(file, contentTypes[index], folder, options)
  );

  return Promise.all(uploadPromises);
}

/**
 * Validate image file
 * @param file - File buffer or base64 string
 * @param contentType - Content type
 * @param options - Upload options
 * @returns Validation result
 */
export function validateImage(
  file: Buffer | string,
  contentType: string,
  options: ImageUploadOptions = {}
): { valid: boolean; error?: string } {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validate content type
  if (opts.allowedTypes && !opts.allowedTypes.includes(contentType)) {
    return {
      valid: false,
      error: `Invalid file type: ${contentType}. Allowed types: ${opts.allowedTypes.join(', ')}`,
    };
  }

  // Convert to buffer if needed
  let buffer: Buffer;
  if (typeof file === 'string') {
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
    buffer = Buffer.from(base64Data, 'base64');
  } else {
    buffer = file;
  }

  // Validate size
  const sizeInMB = buffer.length / (1024 * 1024);
  if (opts.maxSizeInMB && sizeInMB > opts.maxSizeInMB) {
    return {
      valid: false,
      error: `File size (${sizeInMB.toFixed(2)}MB) exceeds maximum allowed size (${opts.maxSizeInMB}MB)`,
    };
  }

  return { valid: true };
}
