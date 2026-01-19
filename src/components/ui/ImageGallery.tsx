// Zynora Platform - Image Gallery Component
// Displays product images with thumbnail grid and fullscreen modal

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Image as ImageIcon,
} from 'lucide-react';
import type { ProductImage } from '../../types';

interface ImageGalleryProps {
  images: ProductImage[];
  alt?: string;
  showThumbnails?: boolean;
  maxThumbnails?: number;
  onImageClick?: (index: number) => void;
}

interface ImageModalProps {
  images: ProductImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

// ============================================
// Image Gallery Styles
// ============================================

const GalleryContainer = styled.div`
  width: 100%;
`;

const MainImageContainer = styled.div`
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 0.75rem;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  cursor: pointer;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${MainImageContainer}:hover & {
    transform: scale(1.05);
  }
`;

const ZoomOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${MainImageContainer}:hover & {
    opacity: 1;
  }
`;

const ZoomIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ThumbnailGrid = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg.tertiary};
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral.grayLight};
    border-radius: 2px;
  }
`;

const Thumbnail = styled.button<{ $isActive: boolean }>`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary.darkGreen : 'transparent'};
  padding: 0;
  cursor: pointer;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.7)};
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    border-color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MoreIndicator = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NoImagePlaceholder = styled.div`
  aspect-ratio: 4/3;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

// ============================================
// Modal Styles
// ============================================

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
`;

const ImageCounter = styled.span`
  color: white;
  font-size: 0.875rem;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ModalContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 4rem;
`;

const FullImage = styled(motion.img)`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 0.5rem;
`;

const NavButton = styled.button<{ $direction: 'left' | 'right' }>`
  position: absolute;
  ${({ $direction }) => ($direction === 'left' ? 'left: 1rem;' : 'right: 1rem;')}
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
  }
`;

const ModalThumbnails = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
`;

const ModalThumbnail = styled.button<{ $isActive: boolean }>`
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid ${({ $isActive }) =>
    $isActive ? 'white' : 'transparent'};
  padding: 0;
  cursor: pointer;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.5)};
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

// ============================================
// Image Modal Component
// ============================================

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { isRTL } = useLanguage();

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <ModalHeader onClick={(e) => e.stopPropagation()}>
            <ImageCounter>
              {currentIndex + 1} / {images.length}
            </ImageCounter>
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          <ModalContent onClick={(e) => e.stopPropagation()}>
            {images.length > 1 && (
              <NavButton
                $direction={isRTL ? 'right' : 'left'}
                onClick={() => onNavigate(currentIndex - 1)}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={24} />
              </NavButton>
            )}

            <FullImage
              key={currentImage.id}
              src={currentImage.url}
              alt={currentImage.alt}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            />

            {images.length > 1 && (
              <NavButton
                $direction={isRTL ? 'left' : 'right'}
                onClick={() => onNavigate(currentIndex + 1)}
                disabled={currentIndex === images.length - 1}
              >
                <ChevronRight size={24} />
              </NavButton>
            )}
          </ModalContent>

          {images.length > 1 && (
            <ModalThumbnails onClick={(e) => e.stopPropagation()}>
              {images.map((image, index) => (
                <ModalThumbnail
                  key={image.id}
                  $isActive={index === currentIndex}
                  onClick={() => onNavigate(index)}
                >
                  <ThumbnailImage src={image.thumbnailUrl} alt={image.alt} />
                </ModalThumbnail>
              ))}
            </ModalThumbnails>
          )}
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

// ============================================
// Image Gallery Component
// ============================================

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  alt = 'Product image',
  showThumbnails = true,
  maxThumbnails = 4,
  onImageClick,
}) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setIsModalOpen(true);
      onImageClick?.(index);
    },
    [onImageClick]
  );

  const handleThumbnailClick = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleModalNavigate = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length]);

  if (images.length === 0) {
    return (
      <GalleryContainer>
        <NoImagePlaceholder>
          <ImageIcon size={32} />
          <span>{t('common.noImages')}</span>
        </NoImagePlaceholder>
      </GalleryContainer>
    );
  }

  const displayThumbnails = images.slice(0, maxThumbnails);
  const remainingCount = images.length - maxThumbnails;

  return (
    <GalleryContainer>
      <MainImageContainer onClick={() => handleImageClick(currentIndex)}>
        <MainImage
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || alt}
        />
        <ZoomOverlay>
          <ZoomIcon>
            <ZoomIn size={24} />
          </ZoomIcon>
        </ZoomOverlay>
      </MainImageContainer>

      {showThumbnails && images.length > 1 && (
        <ThumbnailGrid>
          {displayThumbnails.map((image, index) => (
            <Thumbnail
              key={image.id}
              $isActive={index === currentIndex}
              onClick={() => handleThumbnailClick(index)}
            >
              <ThumbnailImage src={image.thumbnailUrl} alt={image.alt} />
            </Thumbnail>
          ))}
          {remainingCount > 0 && (
            <MoreIndicator onClick={() => handleImageClick(maxThumbnails)}>
              +{remainingCount}
            </MoreIndicator>
          )}
        </ThumbnailGrid>
      )}

      <ImageModal
        images={images}
        currentIndex={currentIndex}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onNavigate={handleModalNavigate}
      />
    </GalleryContainer>
  );
};

// ============================================
// Compact Thumbnail for Offer Cards
// ============================================

interface OfferThumbnailProps {
  images: ProductImage[];
  onClick?: () => void;
}

const CompactThumbnailContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.bg.tertiary};
`;

const CompactImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${CompactThumbnailContainer}:hover & {
    transform: scale(1.1);
  }
`;

const ImageCount = styled.div`
  position: absolute;
  bottom: 0.25rem;
  right: 0.25rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const OfferThumbnail: React.FC<OfferThumbnailProps> = ({
  images,
  onClick,
}) => {

  if (images.length === 0) {
    return (
      <CompactThumbnailContainer>
        <NoImagePlaceholder style={{ aspectRatio: '1' }}>
          <ImageIcon size={24} />
        </NoImagePlaceholder>
      </CompactThumbnailContainer>
    );
  }

  return (
    <CompactThumbnailContainer onClick={onClick}>
      <CompactImage src={images[0].thumbnailUrl} alt={images[0].alt} />
      {images.length > 1 && (
        <ImageCount>
          <ImageIcon size={10} />
          {images.length}
        </ImageCount>
      )}
    </CompactThumbnailContainer>
  );
};

export default ImageGallery;
