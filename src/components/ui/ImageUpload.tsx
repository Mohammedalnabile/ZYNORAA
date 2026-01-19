// Zynora Platform - Image Upload Component
// Allows sellers to upload product images with preview

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  Loader,
  GripVertical,
} from 'lucide-react';
import type { ProductImage } from '../../types';
import {
  validateImage,
  createImagePreview,
  revokeImagePreview,
  generateImageId,
  uploadImage,
  MAX_IMAGES_PER_OFFER,
} from '../../services/imageService';

interface LocalImage {
  id: string;
  file: File;
  previewUrl: string;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  uploadedImage?: ProductImage;
}

interface ImageUploadProps {
  images: LocalImage[];
  onChange: (images: LocalImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

const UploadContainer = styled.div`
  width: 100%;
`;

const UploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

const DropZone = styled(motion.div)<{ $isDragOver: boolean; $disabled: boolean }>`
  border: 2px dashed ${({ theme, $isDragOver }) =>
    $isDragOver ? theme.colors.primary.darkGreen : theme.colors.neutral.grayLighter};
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  background: ${({ theme, $isDragOver }) =>
    $isDragOver
      ? theme.colors.secondary.mint + '20'
      : theme.colors.bg.secondary};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${({ theme, $disabled }) =>
      $disabled ? theme.colors.neutral.grayLighter : theme.colors.primary.darkGreen};
    background: ${({ theme, $disabled }) =>
      $disabled ? theme.colors.bg.secondary : theme.colors.secondary.mint + '10'};
  }
`;

const DropZoneIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.secondary.mint + '30'};
  color: ${({ theme }) => theme.colors.primary.darkGreen};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const DropZoneText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  margin: 0;

  strong {
    color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
`;

const DropZoneHint = styled.p`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 0.75rem;
  margin: 0.5rem 0 0;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreviewCard = styled(motion.div)<{ $isFirst?: boolean }>`
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.75rem;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border: 2px solid ${({ theme, $isFirst }) =>
    $isFirst ? theme.colors.primary.darkGreen : 'transparent'};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.2s ease;

  ${ImagePreviewCard}:hover & {
    opacity: 1;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;

  ${ImagePreviewCard}:hover & {
    opacity: 1;
  }

  &:hover {
    transform: scale(1.1);
    background: #dc2626;
  }
`;

const DragHandle = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  color: white;
  opacity: 0;
  cursor: grab;
  transition: opacity 0.2s ease;

  ${ImagePreviewCard}:hover & {
    opacity: 0.8;
  }
`;

const MainBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: ${({ theme }) => theme.colors.primary.darkGreen};
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
`;

const UploadProgress = styled.div<{ $progress: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  width: ${({ $progress }) => $progress}%;
  background: ${({ theme }) => theme.colors.primary.darkGreen};
  transition: width 0.3s ease;
`;

const UploadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(239, 68, 68, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
`;

const ErrorText = styled.span`
  font-size: 0.625rem;
  color: white;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const ImageCounter = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.5rem;
  text-align: center;
`;

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  maxImages = MAX_IMAGES_PER_OFFER,
  disabled = false,
}) => {
  const { t } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAddMore = images.length < maxImages;

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (disabled) return;

      const fileArray = Array.from(files);
      const availableSlots = maxImages - images.length;
      const filesToProcess = fileArray.slice(0, availableSlots);

      const newImages: LocalImage[] = [];

      for (const file of filesToProcess) {
        const validation = validateImage(file);
        if (validation.valid) {
          const id = generateImageId();
          const previewUrl = createImagePreview(file);
          newImages.push({
            id,
            file,
            previewUrl,
            uploadProgress: 0,
            status: 'pending',
          });
        }
      }

      if (newImages.length === 0) return;

      // Add new images to state
      let currentImages = [...images, ...newImages];
      onChange(currentImages);

      // Upload each image
      for (const localImage of newImages) {
        try {
          // Update status to uploading
          currentImages = currentImages.map((img) =>
            img.id === localImage.id ? { ...img, status: 'uploading' as const } : img
          );
          onChange(currentImages);

          const result = await uploadImage(localImage.file, (progress) => {
            currentImages = currentImages.map((img) =>
              img.id === localImage.id
                ? { ...img, uploadProgress: progress }
                : img
            );
            onChange(currentImages);
          });

          if (result.success && result.image) {
            currentImages = currentImages.map((img) =>
              img.id === localImage.id
                ? {
                    ...img,
                    status: 'completed' as const,
                    uploadProgress: 100,
                    uploadedImage: result.image,
                  }
                : img
            );
            onChange(currentImages);
          } else {
            throw new Error(result.error || 'Upload failed');
          }
        } catch (error) {
          currentImages = currentImages.map((img) =>
            img.id === localImage.id
              ? {
                  ...img,
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'Upload failed',
                }
              : img
          );
          onChange(currentImages);
        }
      }
    },
    [images, maxImages, disabled, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled || !canAddMore) return;

      const files = e.dataTransfer.files;
      handleFiles(files);
    },
    [disabled, canAddMore, handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && canAddMore) {
      fileInputRef.current?.click();
    }
  }, [disabled, canAddMore]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        handleFiles(files);
        // Reset input so same file can be selected again
        e.target.value = '';
      }
    },
    [handleFiles]
  );

  const removeImage = useCallback(
    (id: string) => {
      const imageToRemove = images.find((img) => img.id === id);
      if (imageToRemove) {
        revokeImagePreview(imageToRemove.previewUrl);
      }
      onChange(images.filter((img) => img.id !== id));
    },
    [images, onChange]
  );

  return (
    <UploadContainer>
      <UploadLabel>
        <ImageIcon size={16} />
        {t('seller.offer.images')}
      </UploadLabel>

      {canAddMore && (
        <DropZone
          $isDragOver={isDragOver}
          $disabled={disabled}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          whileTap={{ scale: disabled ? 1 : 0.99 }}
        >
          <DropZoneIcon>
            <Upload size={24} />
          </DropZoneIcon>
          <DropZoneText>
            {t('upload.dragDrop')} <strong>{t('upload.browse')}</strong>
          </DropZoneText>
          <DropZoneHint>
            {t('upload.hint')} ({maxImages - images.length} {t('upload.remaining')})
          </DropZoneHint>
        </DropZone>
      )}

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleInputChange}
        disabled={disabled}
      />

      <AnimatePresence>
        {images.length > 0 && (
          <ImagesGrid>
            {images.map((image, index) => (
              <ImagePreviewCard
                key={image.id}
                $isFirst={index === 0}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <PreviewImage src={image.previewUrl} alt={`Preview ${index + 1}`} />

                {index === 0 && <MainBadge>{t('upload.main')}</MainBadge>}

                {image.status === 'uploading' && (
                  <>
                    <UploadingOverlay>
                      <Loader size={24} color="white" className="spin" />
                    </UploadingOverlay>
                    <UploadProgress $progress={image.uploadProgress} />
                  </>
                )}

                {image.status === 'error' && (
                  <ErrorOverlay>
                    <AlertCircle size={20} color="white" />
                    <ErrorText>{image.error}</ErrorText>
                  </ErrorOverlay>
                )}

                {image.status !== 'uploading' && (
                  <>
                    <ImageOverlay />
                    <RemoveButton
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      title={t('common.delete')}
                    >
                      <X size={14} />
                    </RemoveButton>
                    <DragHandle>
                      <GripVertical size={16} />
                    </DragHandle>
                  </>
                )}
              </ImagePreviewCard>
            ))}
          </ImagesGrid>
        )}
      </AnimatePresence>

      <ImageCounter>
        {images.length} / {maxImages} {t('upload.images')}
      </ImageCounter>
    </UploadContainer>
  );
};

export default ImageUpload;
