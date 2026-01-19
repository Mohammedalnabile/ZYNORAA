import styled from 'styled-components';
import { motion } from 'framer-motion';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const paddingMap = {
  none: '0',
  sm: '0.75rem',
  md: '1.25rem',
  lg: '1.75rem',
};

const StyledCard = styled(motion.div)<{
  $variant: CardProps['variant'];
  $padding: CardProps['padding'];
  $hoverable: boolean;
  $clickable: boolean;
}>`
  background: ${({ theme, $variant }) =>
    $variant === 'glass'
      ? theme.mode === 'dark'
        ? 'rgba(45, 45, 45, 0.8)'
        : 'rgba(255, 255, 255, 0.8)'
      : theme.colors.card.bg};
  border-radius: 1rem;
  padding: ${({ $padding }) => paddingMap[$padding || 'md']};
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.colors.card.border};
  
  ${({ $variant, theme }) =>
    $variant === 'elevated' &&
    `
    box-shadow: ${theme.shadows.medium};
  `}
  
  ${({ $variant, theme }) =>
    $variant === 'outlined' &&
    `
    border: 1px solid ${theme.colors.gold.bronze};
  `}
  
  ${({ $variant }) =>
    $variant === 'glass' &&
    `
    backdrop-filter: blur(10px);
    border: 1px solid rgba(201, 162, 77, 0.2);
  `}
  
  ${({ $hoverable, theme }) =>
    $hoverable &&
    `
    &:hover {
      box-shadow: ${theme.shadows.large};
      border-color: ${theme.colors.gold.primary};
      transform: translateY(-2px);
    }
  `}
  
  ${({ $clickable }) =>
    $clickable &&
    `
    cursor: pointer;
  `}
`;

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  className,
  style,
  onClick,
}) => {
  return (
    <StyledCard
      $variant={variant}
      $padding={padding}
      $hoverable={hoverable}
      $clickable={clickable}
      className={className}
      style={style}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverable ? { scale: 1.01 } : undefined}
      whileTap={clickable ? { scale: 0.99 } : undefined}
    >
      {children}
    </StyledCard>
  );
};

// Offer Card specific component
interface OfferCardProps {
  seller: {
    name: string;
    avatar?: string;
    trustScore: number;
  };
  price: number;
  deliveryTime: string;
  note?: string;
  onCompare?: () => void;
  onChoose?: () => void;
  isSelected?: boolean;
  isNightOffer?: boolean;
}

const OfferCardWrapper = styled(Card)<{ $isSelected: boolean; $isNightOffer: boolean }>`
  border: 2px solid ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary.darkGreen : 'transparent'};
  position: relative;
  overflow: hidden;
  
  ${({ $isNightOffer, theme }) =>
    $isNightOffer &&
    `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, ${theme.colors.secondary.gold}, ${theme.colors.accent.infoBlue});
    }
  `}
`;

const OfferHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const SellerAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.secondary.mint};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.darkGreen};
`;

const SellerInfo = styled.div`
  flex: 1;
`;

const SellerName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const OfferDetails = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.span<{ $large?: boolean; $highlight?: boolean }>`
  font-size: ${({ $large }) => ($large ? '1.5rem' : '1rem')};
  font-weight: 600;
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.secondary.gold : theme.colors.text.primary};
`;

const OfferActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const NightBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${({ theme }) => theme.colors.secondary.gold};
  color: ${({ theme }) => theme.colors.neutral.charcoal};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const OfferCard: React.FC<OfferCardProps> = ({
  seller,
  price,
  deliveryTime,
  note,
  onCompare,
  onChoose,
  isSelected = false,
  isNightOffer = false,
}) => {
  return (
    <OfferCardWrapper
      variant="elevated"
      hoverable
      $isSelected={isSelected}
      $isNightOffer={isNightOffer}
    >
      {isNightOffer && <NightBadge>🌙 Night Offer</NightBadge>}
      <OfferHeader>
        <SellerAvatar>
          {seller.avatar ? (
            <img src={seller.avatar} alt={seller.name} />
          ) : (
            seller.name.charAt(0).toUpperCase()
          )}
        </SellerAvatar>
        <SellerInfo>
          <SellerName>{seller.name}</SellerName>
          <TrustScoreInline score={seller.trustScore} />
        </SellerInfo>
      </OfferHeader>
      
      <OfferDetails>
        <DetailItem>
          <DetailLabel>Price</DetailLabel>
          <DetailValue $large $highlight>
            {price.toLocaleString()} DA
          </DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Delivery</DetailLabel>
          <DetailValue>{deliveryTime}</DetailValue>
        </DetailItem>
      </OfferDetails>
      
      {note && (
        <p style={{ fontSize: '0.875rem', color: 'inherit', opacity: 0.8 }}>
          "{note}"
        </p>
      )}
      
      <OfferActions>
        <Button variant="outline" size="sm" onClick={onCompare}>
          Compare
        </Button>
        <Button variant="primary" size="sm" onClick={onChoose}>
          Choose
        </Button>
      </OfferActions>
    </OfferCardWrapper>
  );
};

// Simple Button for internal use
const Button = styled.button<{ variant: 'outline' | 'primary'; size: 'sm' }>`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
    background: ${theme.colors.primary.darkGreen};
    color: white;
    border: none;
    
    &:hover {
      background: ${theme.colors.primary.darkGreenHover};
    }
  `
      : `
    background: transparent;
    border: 2px solid ${theme.colors.primary.darkGreen};
    color: ${theme.colors.primary.darkGreen};
    
    &:hover {
      background: ${theme.colors.primary.darkGreen};
      color: white;
    }
  `}
`;

// Inline Trust Score
const TrustScoreInline: React.FC<{ score: number }> = ({ score }) => {
  const getColor = () => {
    if (score >= 80) return '#2D6A4F';
    if (score >= 50) return '#FFC300';
    if (score > 0) return '#F94144';
    return '#9CA3AF';
  };

  return (
    <span style={{ fontSize: '0.75rem', color: getColor(), fontWeight: 500 }}>
      ● Trust: {score}%
    </span>
  );
};

export default Card;
