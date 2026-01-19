import styled from 'styled-components';
import { motion } from 'framer-motion';
import React from 'react';

interface TrustScoreProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showExplanation?: boolean;
  variant?: 'circle' | 'bar';
}

const getScoreLevel = (score: number) => {
  if (score >= 80) return { level: 'high', label: 'Confiance Élevée', labelAr: 'ثقة عالية' };
  if (score >= 50) return { level: 'medium', label: 'Confiance Moyenne', labelAr: 'ثقة متوسطة' };
  if (score > 0) return { level: 'low', label: 'Confiance Faible', labelAr: 'ثقة منخفضة' };
  return { level: 'new', label: 'Nouveau', labelAr: 'جديد' };
};

const getScoreColor = (score: number, theme: any) => {
  if (score >= 80) return theme.colors.trust.high;
  if (score >= 50) return theme.colors.trust.medium;
  if (score > 0) return theme.colors.trust.low;
  return theme.colors.trust.new;
};

// Circle Variant
const CircleWrapper = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  ${({ $size }) => {
    const sizes = { sm: 60, md: 80, lg: 120 };
    return `
      --circle-size: ${sizes[$size]}px;
    `;
  }}
`;

const CircleSVG = styled.svg`
  width: var(--circle-size);
  height: var(--circle-size);
  transform: rotate(-90deg);
`;

const CircleBackground = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.colors.bg.tertiary};
  stroke-width: 8;
`;

const CircleProgress = styled(motion.circle)<{ $color: string }>`
  fill: none;
  stroke: ${({ $color }) => $color};
  stroke-width: 8;
  stroke-linecap: round;
`;

const ScoreText = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  
  ${({ $size }) => {
    const fontSizes = { sm: '1rem', md: '1.5rem', lg: '2rem' };
    return `font-size: ${fontSizes[$size]};`;
  }}
`;

const CircleContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LevelLabel = styled.span<{ $color: string }>`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ $color }) => $color};
`;

// Bar Variant
const BarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const BarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BarLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const BarScore = styled.span<{ $color: string }>`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

const BarBackground = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled(motion.div)<{ $color: string }>`
  height: 100%;
  background: ${({ $color }) => $color};
  border-radius: 4px;
`;

// Explanation tooltip
const ExplanationWrapper = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 200px;
`;

const ExplanationItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const TrustScore: React.FC<TrustScoreProps> = ({
  score,
  size = 'md',
  showLabel = true,
  showExplanation = false,
  variant = 'circle',
}) => {
  const { level, label } = getScoreLevel(score);
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  // Get color from theme context would be better, but for simplicity:
  const colorMap = {
    high: '#2D6A4F',
    medium: '#FFC300',
    low: '#F94144',
    new: '#9CA3AF',
  };
  const color = colorMap[level as keyof typeof colorMap];

  if (variant === 'bar') {
    return (
      <BarWrapper>
        <BarHeader>
          <BarLabel>Trust Score</BarLabel>
          <BarScore $color={color}>{score}%</BarScore>
        </BarHeader>
        <BarBackground>
          <BarFill
            $color={color}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </BarBackground>
        {showLabel && <LevelLabel $color={color}>{label}</LevelLabel>}
        
        {showExplanation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ 
              fontSize: '0.75rem', 
              color: '#6B7280', 
              textDecoration: 'underline',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            {isExpanded ? 'Hide details' : 'Why this score?'}
          </button>
        )}
        
        {isExpanded && (
          <ExplanationWrapper
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ExplanationItem>
              <span>Completed orders</span>
              <span>+30%</span>
            </ExplanationItem>
            <ExplanationItem>
              <span>On-time delivery</span>
              <span>+25%</span>
            </ExplanationItem>
            <ExplanationItem>
              <span>Customer ratings</span>
              <span>+20%</span>
            </ExplanationItem>
            <ExplanationItem>
              <span>Account age</span>
              <span>+15%</span>
            </ExplanationItem>
          </ExplanationWrapper>
        )}
      </BarWrapper>
    );
  }

  // Circle variant
  const sizes = { sm: 60, md: 80, lg: 120 };
  const circleSize = sizes[size];
  const strokeWidth = 8;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <CircleWrapper $size={size}>
      <CircleContainer>
        <CircleSVG width={circleSize} height={circleSize}>
          <CircleBackground
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
          />
          <CircleProgress
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            $color={color}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </CircleSVG>
        <ScoreText $size={size}>
          <span style={{ color }}>{score}</span>
        </ScoreText>
      </CircleContainer>
      {showLabel && <LevelLabel $color={color}>{label}</LevelLabel>}
    </CircleWrapper>
  );
};

export default TrustScore;
