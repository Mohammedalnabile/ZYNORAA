// Zynora Platform - Escrow Status Component
// Displays escrow payment status and actions

import styled from 'styled-components';
import { motion } from 'framer-motion';
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Shield,
  Clock,
  Truck,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import type { EscrowStatus as EscrowStatusType, EscrowDetails } from '../../types';
import { getEscrowStatusInfo } from '../../services/paymentService';

interface EscrowStatusProps {
  escrow: EscrowDetails;
  userRole: 'buyer' | 'seller';
  onConfirmDelivery?: () => void;
  onRequestRefund?: () => void;
}

// ============================================
// Styled Components
// ============================================

const EscrowContainer = styled.div`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
`;

const EscrowHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const EscrowIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ $color }) => $color + '20'};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EscrowInfo = styled.div`
  flex: 1;
`;

const EscrowTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EscrowSubtitle = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0.25rem 0 0;
`;

const AmountBadge = styled.div`
  background: ${({ theme }) => theme.colors.primary.darkGreen};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
`;

const StatusTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1.5rem 0;
`;

const TimelineStep = styled.div<{ $status: 'completed' | 'current' | 'pending' }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${({ theme, $status }) =>
    $status === 'current'
      ? theme.colors.secondary.mint + '20'
      : 'transparent'};
  border-radius: 0.5rem;
  opacity: ${({ $status }) => ($status === 'pending' ? 0.5 : 1)};
`;

const StepIcon = styled.div<{ $status: 'completed' | 'current' | 'pending'; $color?: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme, $status, $color }) =>
    $status === 'completed'
      ? $color || theme.colors.status.success
      : $status === 'current'
      ? theme.colors.primary.darkGreen
      : theme.colors.neutral.grayLight};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const StepDescription = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0.125rem 0 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ActionButton = styled(motion.button)<{ $variant: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  ${({ theme, $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary.darkGreen};
          color: white;
          border: none;
          &:hover { background: ${theme.colors.primary.darkGreenHover}; }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.bg.tertiary};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.neutral.grayLighter};
          &:hover { background: ${theme.colors.bg.secondary}; }
        `;
      case 'danger':
        return `
          background: ${theme.colors.accent.alertRed + '10'};
          color: ${theme.colors.accent.alertRed};
          border: 1px solid ${theme.colors.accent.alertRed + '30'};
          &:hover { background: ${theme.colors.accent.alertRed + '20'}; }
        `;
    }
  }}
`;

const WarningBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.secondary.gold + '15'};
  border-radius: 0.75rem;
  margin-top: 1rem;
`;

const WarningIcon = styled.div`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.secondary.gold};
  flex-shrink: 0;
`;

const WarningText = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const PartyInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: 0.75rem;
  margin-bottom: 1rem;
`;

const Party = styled.div`
  text-align: center;
`;

const PartyLabel = styled.p`
  font-size: 0.625rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
`;

const PartyName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0.25rem 0 0;
`;

const ArrowWrapper = styled.div`
  color: ${({ theme }) => theme.colors.neutral.grayLight};
`;

// ============================================
// Helper Functions
// ============================================

const getStatusIcon = (status: EscrowStatusType) => {
  switch (status) {
    case 'awaiting_payment':
      return Clock;
    case 'payment_received':
    case 'delivery_confirmed':
    case 'released_to_seller':
      return CheckCircle;
    case 'awaiting_delivery':
      return Truck;
    case 'refunded_to_buyer':
      return RotateCcw;
    case 'disputed':
      return AlertTriangle;
    default:
      return Shield;
  }
};

const getTimelineSteps = (
  status: EscrowStatusType,
  t: (key: string) => string
): Array<{
  id: string;
  icon: typeof Clock;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}> => {
  const statusOrder: EscrowStatusType[] = [
    'awaiting_payment',
    'payment_received',
    'awaiting_delivery',
    'delivery_confirmed',
    'released_to_seller',
  ];

  const currentIndex = statusOrder.indexOf(status);

  return [
    {
      id: 'payment',
      icon: Clock,
      title: t('escrow.step.payment'),
      description: t('escrow.step.paymentDesc'),
      status: currentIndex >= 1 ? 'completed' : currentIndex === 0 ? 'current' : 'pending',
    },
    {
      id: 'held',
      icon: Shield,
      title: t('escrow.step.held'),
      description: t('escrow.step.heldDesc'),
      status: currentIndex >= 2 ? 'completed' : currentIndex === 1 ? 'current' : 'pending',
    },
    {
      id: 'delivery',
      icon: Truck,
      title: t('escrow.step.delivery'),
      description: t('escrow.step.deliveryDesc'),
      status: currentIndex >= 3 ? 'completed' : currentIndex === 2 ? 'current' : 'pending',
    },
    {
      id: 'release',
      icon: CheckCircle,
      title: t('escrow.step.release'),
      description: t('escrow.step.releaseDesc'),
      status: currentIndex >= 4 ? 'completed' : currentIndex === 3 ? 'current' : 'pending',
    },
  ];
};

// ============================================
// Escrow Status Component
// ============================================

export const EscrowStatusComponent: React.FC<EscrowStatusProps> = ({
  escrow,
  userRole,
  onConfirmDelivery,
  onRequestRefund,
}) => {
  const { t } = useLanguage();
  const statusInfo = getEscrowStatusInfo(escrow.status);
  const StatusIcon = getStatusIcon(escrow.status);
  const timelineSteps = getTimelineSteps(escrow.status, t);

  const showConfirmButton =
    userRole === 'buyer' && escrow.status === 'awaiting_delivery';
  const showRefundButton =
    userRole === 'buyer' &&
    ['awaiting_delivery', 'payment_received'].includes(escrow.status);

  return (
    <EscrowContainer>
      <PartyInfo>
        <Party>
          <PartyLabel>{t('escrow.buyer')}</PartyLabel>
          <PartyName>{escrow.buyer.name}</PartyName>
        </Party>
        <ArrowWrapper>
          <ArrowRight size={20} />
        </ArrowWrapper>
        <Party>
          <PartyLabel>{t('escrow.seller')}</PartyLabel>
          <PartyName>{escrow.seller.name}</PartyName>
        </Party>
      </PartyInfo>

      <EscrowHeader>
        <EscrowIcon $color={statusInfo.color}>
          <StatusIcon size={24} />
        </EscrowIcon>
        <EscrowInfo>
          <EscrowTitle>{t(statusInfo.labelKey)}</EscrowTitle>
          <EscrowSubtitle>{t('escrow.protected')}</EscrowSubtitle>
        </EscrowInfo>
        <AmountBadge>{escrow.amount.toLocaleString()} DA</AmountBadge>
      </EscrowHeader>

      <StatusTimeline>
        {timelineSteps.map((step) => (
          <TimelineStep key={step.id} $status={step.status}>
            <StepIcon $status={step.status}>
              <step.icon size={14} />
            </StepIcon>
            <StepContent>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepContent>
          </TimelineStep>
        ))}
      </StatusTimeline>

      {(showConfirmButton || showRefundButton) && (
        <ActionButtons>
          {showConfirmButton && (
            <ActionButton
              $variant="primary"
              onClick={onConfirmDelivery}
              whileTap={{ scale: 0.98 }}
            >
              <CheckCircle size={16} />
              {t('escrow.confirmDelivery')}
            </ActionButton>
          )}
          {showRefundButton && (
            <ActionButton
              $variant="danger"
              onClick={onRequestRefund}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw size={16} />
              {t('escrow.requestRefund')}
            </ActionButton>
          )}
        </ActionButtons>
      )}

      <WarningBox>
        <WarningIcon>
          <Shield size={20} />
        </WarningIcon>
        <WarningText>{t('escrow.securityNote')}</WarningText>
      </WarningBox>
    </EscrowContainer>
  );
};

export default EscrowStatusComponent;
