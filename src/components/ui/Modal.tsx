import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
  overflow-y: auto;
`;

const ModalContainer = styled(motion.div)<{ $size: string }>`
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return '380px';
      case 'md':
        return '500px';
      case 'lg':
        return '680px';
      case 'xl':
        return '900px';
      case 'full':
        return 'calc(100vw - 2rem)';
      default:
        return '500px';
    }
  }};
  max-height: calc(100vh - 2rem);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gold.bronze};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.neutral.grayLight};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <ModalContainer
            $size={size}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {(title || showCloseButton) && (
              <ModalHeader>
                <ModalTitle>{title}</ModalTitle>
                {showCloseButton && (
                  <CloseButton onClick={onClose}>
                    <X size={18} />
                  </CloseButton>
                )}
              </ModalHeader>
            )}
            <ModalBody>{children}</ModalBody>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

// Bottom Sheet variant for mobile
const SheetOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const SheetContainer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 1.5rem 1.5rem 0 0;
  max-height: 90vh;
  overflow: hidden;
  z-index: 1001;
`;

const SheetHandle = styled.div`
  width: 40px;
  height: 4px;
  background: ${({ theme }) => theme.colors.neutral.grayLight};
  border-radius: 2px;
  margin: 0.75rem auto 1rem;
`;

const sheetVariants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.2 },
  },
};

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <SheetOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <SheetContainer
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SheetHandle />
            {title && (
              <ModalHeader style={{ borderBottom: 'none', paddingTop: 0 }}>
                <ModalTitle>{title}</ModalTitle>
                <CloseButton onClick={onClose}>
                  <X size={18} />
                </CloseButton>
              </ModalHeader>
            )}
            <ModalBody style={{ paddingTop: title ? 0 : '0.5rem' }}>{children}</ModalBody>
          </SheetContainer>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
