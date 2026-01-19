import styled from 'styled-components';
import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  rows?: number;
}

const TextareaWrapper = styled.div<{ $fullWidth: boolean }>`
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

const TextareaContainer = styled.div<{ $hasError: boolean; $isFocused: boolean }>`
  padding: 0;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border: 2px solid ${({ theme, $hasError, $isFocused }) =>
    $hasError
      ? theme.colors.accent.alertRed
      : $isFocused
      ? theme.colors.primary.darkGreen
      : theme.colors.neutral.grayLighter};
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.accent.alertRed : theme.colors.primary.darkGreen};
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;
  padding: 0.875rem 1rem;
  resize: vertical;
  min-height: 100px;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.accent.alertRed};
`;

const HintText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = true,
      rows = 4,
      className,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <TextareaWrapper $fullWidth={fullWidth} className={className}>
        {label && <Label>{label}</Label>}
        <TextareaContainer $hasError={!!error} $isFocused={isFocused}>
          <StyledTextarea
            ref={ref}
            rows={rows}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />
        </TextareaContainer>
        {error && <ErrorText>{error}</ErrorText>}
        {hint && <HintText>{hint}</HintText>}
      </TextareaWrapper>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
