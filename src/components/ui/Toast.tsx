import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  width: calc(100vw - 2rem);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: auto;
    bottom: 1rem;
    left: 1rem;
  }
`;

const ToastItem = styled(motion.div)<{ $type: ToastType }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border-left: 4px solid ${({ theme, $type }) => {
    switch ($type) {
      case 'success':
        return theme.colors.primary.darkGreen;
      case 'error':
        return theme.colors.accent.alertRed;
      case 'warning':
        return theme.colors.secondary.gold;
      case 'info':
        return theme.colors.accent.infoBlue;
      default:
        return theme.colors.primary.darkGreen;
    }
  }};
`;

const IconWrapper = styled.div<{ $type: ToastType }>`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: ${({ theme, $type }) => {
    switch ($type) {
      case 'success':
        return theme.colors.primary.darkGreen;
      case 'error':
        return theme.colors.accent.alertRed;
      case 'warning':
        return theme.colors.secondary.gold;
      case 'info':
        return theme.colors.accent.infoBlue;
      default:
        return theme.colors.primary.darkGreen;
    }
  }};
`;

const ToastContent = styled.div`
  flex: 1;
`;

const ToastTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.125rem;
`;

const ToastMessage = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={24} />;
    case 'error':
      return <XCircle size={24} />;
    case 'warning':
      return <AlertCircle size={24} />;
    case 'info':
      return <Info size={24} />;
    default:
      return <Info size={24} />;
  }
};

const toastVariants = {
  initial: {
    opacity: 0,
    x: 50,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    x: 50,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 11);
    const newToast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);
    
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer>
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              $type={toast.type}
              variants={toastVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
            >
              <IconWrapper $type={toast.type}>{getIcon(toast.type)}</IconWrapper>
              <ToastContent>
                <ToastTitle>{toast.title}</ToastTitle>
                {toast.message && <ToastMessage>{toast.message}</ToastMessage>}
              </ToastContent>
              <CloseButton onClick={() => hideToast(toast.id)}>
                <X size={16} />
              </CloseButton>
            </ToastItem>
          ))}
        </AnimatePresence>
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
