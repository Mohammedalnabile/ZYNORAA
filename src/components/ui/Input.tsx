import styled from 'styled-components';
import { motion } from 'framer-motion';
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const InputWrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InputContainer = styled.div<{ $hasError: boolean; $isFocused: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: ${({ theme }) => theme.colors.input.bg};
  border: 2px solid ${({ theme, $hasError, $isFocused }) =>
    $hasError
      ? theme.colors.status.error
      : $isFocused
      ? theme.colors.input.focusBorder
      : theme.colors.input.border};
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.status.error : theme.colors.gold.primary};
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gold.bronze};
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const HintText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorText = styled(motion.span)`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.status.error};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, fullWidth = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <InputWrapper $fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <InputContainer $hasError={!!error} $isFocused={isFocused}>
          {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
          <StyledInput
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
        </InputContainer>
        {error && (
          <ErrorText
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </ErrorText>
        )}
        {hint && !error && <HintText>{hint}</HintText>}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

const StyledTextarea = styled.textarea`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const TextareaContainer = styled(InputContainer)`
  align-items: flex-start;
`;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, fullWidth = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <InputWrapper $fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <TextareaContainer $hasError={!!error} $isFocused={isFocused}>
          <StyledTextarea
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
        </TextareaContainer>
        {error && (
          <ErrorText
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </ErrorText>
        )}
        {hint && !error && <HintText>{hint}</HintText>}
      </InputWrapper>
    );
  }
);

Textarea.displayName = 'Textarea';
