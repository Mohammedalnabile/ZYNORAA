// Zynora Platform - Carte Edahabia Payment Component
// Algerian Golden Card (Algérie Poste) Payment Form

import styled from 'styled-components';
import { motion } from 'framer-motion';
import React, { useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
// Theme import - can be used for conditional styling
// import { useTheme } from '../../context/ThemeContext';
import {
  CreditCard,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader,
} from 'lucide-react';
import type { EdahabiaCardDetails, PaymentRequest } from '../../types';
import {
  validateCardDetails,
  formatCardNumber,
  formatExpiryDate,
  initiateEdahabiaPayment,
} from '../../services/paymentService';

interface EdahabiaPaymentProps {
  orderId: string;
  amount: number;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

// ============================================
// Styled Components
// ============================================

const PaymentContainer = styled.div`
  width: 100%;
  max-width: 480px;
`;

const PaymentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const EdahabiaLogo = styled.div`
  width: 64px;
  height: 40px;
  background: linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  color: #1B1B1B;
  letter-spacing: -0.5px;
`;

const PaymentTitle = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Subtitle = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0.25rem 0 0;
`;

const AmountDisplay = styled.div`
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const AmountLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 0.25rem;
`;

const AmountValue = styled.p`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.darkGreen};
  margin: 0;

  span {
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputWrapper = styled.div<{ $hasError?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border: 2px solid ${({ theme, $hasError }) =>
    $hasError ? theme.colors.accent.alertRed : theme.colors.neutral.grayLighter};
  border-radius: 0.75rem;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.accent.alertRed : theme.colors.primary.darkGreen};
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: 'SF Mono', Monaco, monospace;
  letter-spacing: 0.5px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
    font-family: inherit;
    letter-spacing: normal;
  }

  &:focus {
    outline: none;
  }
`;

const InputIcon = styled.div`
  padding: 0 1rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.accent.alertRed};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.secondary.mint + '20'};
  border-radius: 0.75rem;
  margin: 0.5rem 0;
`;

const SecurityIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary.darkGreen};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SecurityText = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const PayButton = styled(motion.button)<{ $disabled?: boolean }>`
  width: 100%;
  padding: 1rem;
  background: ${({ theme, $disabled }) =>
    $disabled
      ? theme.colors.neutral.grayLight
      : 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)'};
  color: ${({ $disabled }) => ($disabled ? 'white' : '#1B1B1B')};
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const SuccessContainer = styled(motion.div)`
  text-align: center;
  padding: 2rem;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.status.success + '20'};
  color: ${({ theme }) => theme.colors.status.success};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
`;

const SuccessTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem;
`;

const SuccessMessage = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const ProcessingOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(27, 27, 27, 0.9)' : 'rgba(248, 249, 250, 0.9)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 1rem;
  z-index: 10;
`;

const ProcessingText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// ============================================
// Edahabia Payment Component
// ============================================

export const EdahabiaPayment: React.FC<EdahabiaPaymentProps> = ({
  orderId,
  amount,
  onSuccess,
  onError,
  onCancel,
}) => {
  const { t } = useLanguage();
  
  const [cardDetails, setCardDetails] = useState<EdahabiaCardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // Transaction ID stored after successful payment
  const [, setTransactionId] = useState<string>('');

  const handleInputChange = useCallback(
    (field: keyof EdahabiaCardDetails) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Format based on field
        if (field === 'cardNumber') {
          value = formatCardNumber(value);
        } else if (field === 'expiryDate') {
          value = formatExpiryDate(value);
        } else if (field === 'cvv') {
          value = value.replace(/\D/g, '').slice(0, 3);
        }

        setCardDetails((prev) => ({ ...prev, [field]: value }));
        
        // Clear error on change
        if (errors[field]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
      },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate
      const validation = validateCardDetails({
        ...cardDetails,
        cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
      });

      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }

      setIsProcessing(true);
      setErrors({});

      try {
        const request: PaymentRequest = {
          orderId,
          amount,
          method: 'edahabia',
          cardDetails: {
            ...cardDetails,
            cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
          },
        };

        const response = await initiateEdahabiaPayment(request);

        if (response.success && response.transaction) {
          setIsSuccess(true);
          setTransactionId(response.transaction.id);
          onSuccess?.(response.transaction.id);
        } else {
          throw new Error(response.error || t('payment.error.failed'));
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : t('payment.error.failed');
        setErrors({ submit: errorMessage });
        onError?.(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    },
    [cardDetails, orderId, amount, t, onSuccess, onError]
  );

  if (isSuccess) {
    return (
      <PaymentContainer>
        <SuccessContainer
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <SuccessIcon>
            <CheckCircle size={40} />
          </SuccessIcon>
          <SuccessTitle>{t('payment.success.title')}</SuccessTitle>
          <SuccessMessage>{t('payment.success.escrowMessage')}</SuccessMessage>
        </SuccessContainer>
      </PaymentContainer>
    );
  }

  return (
    <PaymentContainer style={{ position: 'relative' }}>
      {isProcessing && (
        <ProcessingOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader size={32} className="spin" />
          <ProcessingText>{t('payment.processing')}</ProcessingText>
        </ProcessingOverlay>
      )}

      <PaymentHeader>
        <EdahabiaLogo>EDAHABIA</EdahabiaLogo>
        <PaymentTitle>
          <Title>{t('payment.edahabia.title')}</Title>
          <Subtitle>{t('payment.edahabia.subtitle')}</Subtitle>
        </PaymentTitle>
      </PaymentHeader>

      <AmountDisplay>
        <AmountLabel>{t('payment.amount')}</AmountLabel>
        <AmountValue>
          {amount.toLocaleString()} <span>DA</span>
        </AmountValue>
      </AmountDisplay>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>
            <CreditCard size={16} />
            {t('payment.cardNumber')}
          </Label>
          <InputWrapper $hasError={!!errors.cardNumber}>
            <Input
              type="text"
              placeholder="6033 XXXX XXXX XXXX"
              value={cardDetails.cardNumber}
              onChange={handleInputChange('cardNumber')}
              dir="ltr"
              autoComplete="cc-number"
            />
          </InputWrapper>
          {errors.cardNumber && (
            <ErrorMessage>
              <AlertCircle size={12} />
              {errors.cardNumber}
            </ErrorMessage>
          )}
        </InputGroup>

        <InputGroup>
          <Label>{t('payment.cardHolder')}</Label>
          <InputWrapper $hasError={!!errors.cardHolderName}>
            <Input
              type="text"
              placeholder={t('payment.cardHolderPlaceholder')}
              value={cardDetails.cardHolderName}
              onChange={handleInputChange('cardHolderName')}
              autoComplete="cc-name"
            />
          </InputWrapper>
          {errors.cardHolderName && (
            <ErrorMessage>
              <AlertCircle size={12} />
              {errors.cardHolderName}
            </ErrorMessage>
          )}
        </InputGroup>

        <Row>
          <InputGroup>
            <Label>{t('payment.expiry')}</Label>
            <InputWrapper $hasError={!!errors.expiryDate}>
              <Input
                type="text"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={handleInputChange('expiryDate')}
                dir="ltr"
                autoComplete="cc-exp"
              />
            </InputWrapper>
            {errors.expiryDate && (
              <ErrorMessage>
                <AlertCircle size={12} />
                {errors.expiryDate}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>{t('payment.cvv')}</Label>
            <InputWrapper $hasError={!!errors.cvv}>
              <Input
                type="password"
                placeholder="•••"
                value={cardDetails.cvv}
                onChange={handleInputChange('cvv')}
                dir="ltr"
                autoComplete="cc-csc"
                maxLength={3}
              />
              <InputIcon>
                <Lock size={16} />
              </InputIcon>
            </InputWrapper>
            {errors.cvv && (
              <ErrorMessage>
                <AlertCircle size={12} />
                {errors.cvv}
              </ErrorMessage>
            )}
          </InputGroup>
        </Row>

        {errors.submit && (
          <ErrorMessage>
            <AlertCircle size={12} />
            {errors.submit}
          </ErrorMessage>
        )}

        <SecurityNote>
          <SecurityIcon>
            <Shield size={16} />
          </SecurityIcon>
          <SecurityText>{t('payment.escrowNote')}</SecurityText>
        </SecurityNote>

        <PayButton
          type="submit"
          $disabled={isProcessing}
          whileTap={{ scale: isProcessing ? 1 : 0.98 }}
        >
          <Lock size={16} />
          {t('payment.payButton')} {amount.toLocaleString()} DA
        </PayButton>

        {onCancel && (
          <CancelButton type="button" onClick={onCancel}>
            {t('common.cancel')}
          </CancelButton>
        )}
      </Form>
    </PaymentContainer>
  );
};

export default EdahabiaPayment;
