import styled, { css } from 'styled-components';
import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const sizeStyles = {
  sm: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: 0.5rem;
  `,
  md: css`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 0.75rem;
  `,
  lg: css`
    padding: 1rem 2rem;
    font-size: 1.125rem;
    border-radius: 1rem;
  `,
  xl: css`
    padding: 1.25rem 2.5rem;
    font-size: 1.25rem;
    border-radius: 1rem;
  `,
};

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.button.primary.bg};
    color: ${({ theme }) => theme.colors.button.primary.text};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.button.primary.hover};
      box-shadow: 0 4px 12px ${({ theme }) => theme.shadows.glow};
    }
    
    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.button.secondary.bg};
    color: ${({ theme }) => theme.colors.button.secondary.text};
    border: 1px solid ${({ theme }) => theme.colors.elegant.emerald};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.button.secondary.hover};
      box-shadow: 0 4px 12px ${({ theme }) => theme.shadows.base};
    }
  `,
  outline: css`
    background: transparent;
    border: 2px solid ${({ theme }) => theme.colors.elegant.emerald};
    color: ${({ theme }) => theme.colors.elegant.emerald};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.elegant.emerald};
      color: #FFFFFF;
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.bg.tertiary};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.status.error};
    color: white;
    
    &:hover:not(:disabled) {
      background: #D32F2F;
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
    }
  `,
  gold: css`
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.elegant.emerald}, ${({ theme }) => theme.colors.elegant.emeraldDark});
    color: #FFFFFF;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${({ theme }) => theme.colors.elegant.emeraldDark}, ${({ theme }) => theme.colors.elegant.emerald});
      box-shadow: 0 4px 16px ${({ theme }) => theme.shadows.emeraldGlow};
    }
  `,
};

const StyledButton = styled(motion.button)<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.gold.primary};
    outline-offset: 2px;
  }
`;

const LoadingSpinner = styled(motion.span)`
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading ? (
        <LoadingSpinner
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </StyledButton>
  );
};
