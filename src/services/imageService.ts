// Zynora Platform - Image Upload Service
// Handles product image uploads for sellers

// API import - uncomment when backend is ready
// import { api } from './api';
import type { ProductImage, ImageUploadResult, ApiResponse } from '../types';

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Maximum images per offer
export const MAX_IMAGES_PER_OFFER = 5;
// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  errorKey?: string; // Translation key
}

/**
 * Validate an image file before upload
 */
export function validateImage(file: File): ImageValidationResult {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
      errorKey: 'upload.error.invalidType',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 5MB.',
      errorKey: 'upload.error.tooLarge',
    };
  }

  return { valid: true };
}

/**
 * Create a local preview URL for an image file
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke a preview URL to free memory
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Generate a unique ID for local image tracking
 */
export function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Upload a single image to the server
 * Returns the uploaded image data with URLs
 */
export async function uploadImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ImageUploadResult> {
  const validation = validateImage(file);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    // TODO: Replace with actual API endpoint when backend is ready
    // For now, simulate upload with local preview
    const mockUpload = await simulateImageUpload(file, onProgress);
    
    return {
      success: true,
      image: mockUpload,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Upload multiple images
 */
export async function uploadImages(
  files: File[],
  onProgress?: (index: number, progress: number) => void
): Promise<ImageUploadResult[]> {
  const results: ImageUploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(files[i], (progress) => {
      onProgress?.(i, progress);
    });
    results.push(result);
  }

  return results;
}

/**
 * Delete an uploaded image
 */
export async function deleteImage(_imageId: string): Promise<ApiResponse<void>> {
  try {
    // TODO: Replace with actual API call
    // await api.delete(`/images/${imageId}`);
    
    // Simulate deletion
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

/**
 * Reorder images (update display order)
 */
export async function reorderImages(
  _imageIds: string[]
): Promise<ApiResponse<ProductImage[]>> {
  try {
    // TODO: Replace with actual API call
    // return await api.put('/images/reorder', { imageIds });
    
    // Simulate reorder
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    return { success: true, data: [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Reorder failed',
    };
  }
}

// ============================================
// Mock Implementation (Remove when backend ready)
// ============================================

/**
 * Simulate image upload for development
 * TODO: Remove when backend is integrated
 */
async function simulateImageUpload(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ProductImage> {
  // Simulate upload progress
  for (let i = 0; i <= 100; i += 10) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    onProgress?.(i);
  }

  // Create a local preview URL as the "uploaded" URL
  const previewUrl = createImagePreview(file);

  return {
    id: generateImageId(),
    url: previewUrl,
    thumbnailUrl: previewUrl, // Same URL for mock
    alt: file.name,
    order: 0,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Get image dimensions
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Compress image before upload (optional optimization)
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        quality
      );

      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}
