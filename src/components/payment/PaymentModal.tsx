// Zynora Platform - Payment Modal Component
// Modal wrapper for payment flows

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X } from 'lucide-react';
import { EdahabiaPayment } from './EdahabiaPayment';
import type { PaymentMethod } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  method?: PaymentMethod;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

// ============================================
// Styled Components
// ============================================

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
`;

const ModalTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bg.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
`;

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const PaymentMethodButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.secondary.mint + '30' : theme.colors.bg.secondary};
  border: 2px solid ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary.darkGreen : 'transparent'};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary.mint + '20'};
  }
`;

const MethodLogo = styled.div<{ $type: PaymentMethod }>`
  width: 48px;
  height: 32px;
  border-radius: 0.25rem;
  background: ${({ $type }) =>
    $type === 'edahabia'
      ? 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)'
      : '#E5E7EB'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  font-weight: 700;
  color: ${({ $type }) => ($type === 'edahabia' ? '#1B1B1B' : '#6B7280')};
`;

const MethodInfo = styled.div`
  flex: 1;
`;

const MethodName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const MethodDescription = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0.125rem 0 0;
`;

const RadioCircle = styled.div<{ $isActive: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary.darkGreen : theme.colors.neutral.grayLight};
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary.darkGreen};
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
    transition: opacity 0.2s ease;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.neutral.grayLighter};
  margin: 1.5rem 0;
`;

// ============================================
// Payment Modal Component
// ============================================

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  amount,
  method: initialMethod = 'edahabia',
  onSuccess,
  onError,
}) => {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>(initialMethod);

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

  const handleSuccess = (transactionId: string) => {
    onSuccess?.(transactionId);
    // Keep modal open to show success state
  };

  const paymentMethods: { type: PaymentMethod; name: string; description: string }[] = [
    {
      type: 'edahabia',
      name: t('payment.methods.edahabia'),
      description: t('payment.methods.edahabiaDesc'),
    },
    {
      type: 'ccp',
      name: t('payment.methods.ccp'),
      description: t('payment.methods.ccpDesc'),
    },
    {
      type: 'cash',
      name: t('payment.methods.cash'),
      description: t('payment.methods.cashDesc'),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>{t('payment.title')}</ModalTitle>
              <CloseButton onClick={onClose}>
                <X size={18} />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              <PaymentMethods>
                {paymentMethods.map((method) => (
                  <PaymentMethodButton
                    key={method.type}
                    $isActive={selectedMethod === method.type}
                    onClick={() => setSelectedMethod(method.type)}
                  >
                    <MethodLogo $type={method.type}>
                      {method.type === 'edahabia' ? 'EDAHABIA' : method.type.toUpperCase()}
                    </MethodLogo>
                    <MethodInfo>
                      <MethodName>{method.name}</MethodName>
                      <MethodDescription>{method.description}</MethodDescription>
                    </MethodInfo>
                    <RadioCircle $isActive={selectedMethod === method.type} />
                  </PaymentMethodButton>
                ))}
              </PaymentMethods>

              <Divider />

              {selectedMethod === 'edahabia' && (
                <EdahabiaPayment
                  orderId={orderId}
                  amount={amount}
                  onSuccess={handleSuccess}
                  onError={onError}
                  onCancel={onClose}
                />
              )}

              {selectedMethod === 'ccp' && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                  {t('payment.ccpInstructions')}
                </div>
              )}

              {selectedMethod === 'cash' && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                  {t('payment.cashInstructions')}
                </div>
              )}
            </ModalContent>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
