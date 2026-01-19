import styled from 'styled-components';
import { motion } from 'framer-motion';
import React from 'react';

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  labelOn?: string;
  labelOff?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showLabels?: boolean;
}

const sizeConfig = {
  sm: { width: 40, height: 22, circle: 16 },
  md: { width: 52, height: 28, circle: 22 },
  lg: { width: 64, height: 34, circle: 28 },
};

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ToggleLabel = styled.span<{ $isActive: boolean }>`
  font-size: 0.875rem;
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 400)};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.gold.primary : theme.colors.text.secondary};
  transition: all 0.2s ease;
`;

const ToggleTrack = styled(motion.button)<{
  $isOn: boolean;
  $size: 'sm' | 'md' | 'lg';
  $disabled: boolean;
}>`
  position: relative;
  width: ${({ $size }) => sizeConfig[$size].width}px;
  height: ${({ $size }) => sizeConfig[$size].height}px;
  border-radius: ${({ $size }) => sizeConfig[$size].height}px;
  border: none;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  background: ${({ theme, $isOn }) =>
    $isOn ? theme.colors.gold.primary : theme.colors.gold.bronze};
  transition: background 0.3s ease;
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.gold.primary};
    outline-offset: 2px;
  }
`;

const ToggleThumb = styled(motion.div)<{ $size: 'sm' | 'md' | 'lg' }>`
  position: absolute;
  top: ${({ $size }) => (sizeConfig[$size].height - sizeConfig[$size].circle) / 2}px;
  width: ${({ $size }) => sizeConfig[$size].circle}px;
  height: ${({ $size }) => sizeConfig[$size].circle}px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const Toggle: React.FC<ToggleProps> = ({
  isOn,
  onToggle,
  labelOn,
  labelOff,
  size = 'md',
  disabled = false,
  showLabels = false,
}) => {
  const config = sizeConfig[size];
  const thumbPosition = isOn
    ? config.width - config.circle - (config.height - config.circle) / 2
    : (config.height - config.circle) / 2;

  return (
    <ToggleWrapper>
      {showLabels && labelOff && (
        <ToggleLabel $isActive={!isOn}>{labelOff}</ToggleLabel>
      )}
      <ToggleTrack
        $isOn={isOn}
        $size={size}
        $disabled={disabled}
        onClick={() => !disabled && onToggle()}
        whileTap={disabled ? {} : { scale: 0.95 }}
        role="switch"
        aria-checked={isOn}
      >
        <ToggleThumb
          $size={size}
          animate={{ left: thumbPosition }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </ToggleTrack>
      {showLabels && labelOn && (
        <ToggleLabel $isActive={isOn}>{labelOn}</ToggleLabel>
      )}
    </ToggleWrapper>
  );
};

// Availability Toggle (Driver specific)
interface AvailabilityToggleProps {
  isAvailable: boolean;
  onToggle: () => void;
}

const AvailabilityWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
`;

const StatusDot = styled(motion.div)<{ $isAvailable: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ theme, $isAvailable }) =>
    $isAvailable ? theme.colors.status.success : theme.colors.neutral.grayLight};
`;

const StatusText = styled.span<{ $isAvailable: boolean }>`
  font-weight: 600;
  color: ${({ theme, $isAvailable }) =>
    $isAvailable ? theme.colors.status.success : theme.colors.text.secondary};
`;

export const AvailabilityToggle: React.FC<AvailabilityToggleProps> = ({
  isAvailable,
  onToggle,
}) => {
  return (
    <AvailabilityWrapper>
      <StatusDot
        $isAvailable={isAvailable}
        animate={{
          scale: isAvailable ? [1, 1.2, 1] : 1,
          boxShadow: isAvailable
            ? '0 0 0 4px rgba(16, 185, 129, 0.2)'
            : 'none',
        }}
        transition={{ repeat: isAvailable ? Infinity : 0, duration: 2 }}
      />
      <StatusText $isAvailable={isAvailable}>
        {isAvailable ? 'Available' : 'Not Available'}
      </StatusText>
      <Toggle isOn={isAvailable} onToggle={onToggle} size="md" />
    </AvailabilityWrapper>
  );
};

export default Toggle;
