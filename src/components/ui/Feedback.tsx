import styled from 'styled-components';
import { motion } from 'framer-motion';
import React from 'react';

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold' | 'night';
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

const badgeColors = {
  default: { bg: '#E5E7EB', text: '#374151' },
  success: { bg: '#D1FAE5', text: '#065F46' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  error: { bg: '#FEE2E2', text: '#991B1B' },
  info: { bg: '#DBEAFE', text: '#1E40AF' },
  gold: { bg: '#FFC300', text: '#333333' },
  night: { bg: '#1B1B1B', text: '#FFC300' },
};

const StyledBadge = styled.span<{ $variant: BadgeProps['variant']; $size: BadgeProps['size'] }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: ${({ $size }) => ($size === 'sm' ? '0.25rem 0.5rem' : '0.375rem 0.75rem')};
  font-size: ${({ $size }) => ($size === 'sm' ? '0.75rem' : '0.875rem')};
  font-weight: 500;
  border-radius: 9999px;
  background: ${({ $variant }) => badgeColors[$variant || 'default'].bg};
  color: ${({ $variant }) => badgeColors[$variant || 'default'].text};
`;

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  style,
}) => {
  return (
    <StyledBadge $variant={variant} $size={size} style={style}>
      {children}
    </StyledBadge>
  );
};

// Loading Spinner
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const spinnerSizes = { sm: 16, md: 24, lg: 40 };

const SpinnerSVG = styled(motion.svg)<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
`;

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color }) => {
  const sizeValue = spinnerSizes[size];
  
  return (
    <SpinnerSVG
      $size={sizeValue}
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color || '#2D6A4F'}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="12"
      />
    </SpinnerSVG>
  );
};

// Loading State Component
interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

const LoadingWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
`;

const LoadingMessage = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const DotsWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled(motion.span)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary.darkGreen};
`;

const PulseCircle = styled(motion.div)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary.darkGreen};
  opacity: 0.3;
`;

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  variant = 'spinner',
}) => {
  return (
    <LoadingWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {variant === 'spinner' && <Spinner size="lg" />}
      
      {variant === 'dots' && (
        <DotsWrapper>
          {[0, 1, 2].map((i) => (
            <Dot
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </DotsWrapper>
      )}
      
      {variant === 'pulse' && (
        <PulseCircle
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      
      <LoadingMessage>{message}</LoadingMessage>
    </LoadingWrapper>
  );
};

// Skeleton Loader
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circle' | 'rect';
  count?: number;
}

const SkeletonBase = styled(motion.div)<{
  $width: string;
  $height: string;
  $variant: SkeletonProps['variant'];
}>`
  background: ${({ theme }) =>
    theme.mode === 'dark'
      ? 'linear-gradient(90deg, #2D2D2D 25%, #3D3D3D 50%, #2D2D2D 75%)'
      : 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'};
  background-size: 200% 100%;
  border-radius: ${({ $variant }) =>
    $variant === 'circle' ? '50%' : $variant === 'text' ? '4px' : '8px'};
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
`;

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  variant = 'text',
  count = 1,
}) => {
  const widthStr = typeof width === 'number' ? `${width}px` : width;
  const heightStr = typeof height === 'number' ? `${height}px` : height;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBase
          key={i}
          $width={widthStr}
          $height={heightStr}
          $variant={variant}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{ marginBottom: i < count - 1 ? '0.5rem' : 0 }}
        />
      ))}
    </>
  );
};

// Empty State
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 300px;
  margin-bottom: 1.5rem;
`;

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <EmptyWrapper>
      {icon && <EmptyIcon>{icon}</EmptyIcon>}
      <EmptyTitle>{title}</EmptyTitle>
      {description && <EmptyDescription>{description}</EmptyDescription>}
      {action}
    </EmptyWrapper>
  );
};

export { Badge as default };
