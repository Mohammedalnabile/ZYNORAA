import styled from 'styled-components';
import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  onExploreClick?: () => void;
}

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled(motion.main)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  showFooter = true,
  onExploreClick,
}) => {
  return (
    <LayoutWrapper>
      <Header onExploreClick={onExploreClick} />
      <Main {...pageTransition}>{children}</Main>
      {showFooter && <Footer />}
    </LayoutWrapper>
  );
};

// Container component for consistent page padding
export const Container = styled.div<{ $size?: 'sm' | 'md' | 'lg' | 'full' }>`
  width: 100%;
  max-width: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return '640px';
      case 'md':
        return '960px';
      case 'lg':
        return '1280px';
      case 'full':
        return 'none';
      default:
        return '1280px';
    }
  }};
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

// Section component for page sections
export const Section = styled.section<{ $padding?: 'sm' | 'md' | 'lg' }>`
  padding: ${({ $padding }) => {
    switch ($padding) {
      case 'sm':
        return '2rem 0';
      case 'lg':
        return '6rem 0';
      default:
        return '4rem 0';
    }
  }};
`;

// Grid layouts
export const Grid = styled.div<{
  $columns?: number;
  $gap?: string;
  $minWidth?: string;
}>`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ $minWidth }) => $minWidth || '280px'}, 1fr)
  );
  gap: ${({ $gap }) => $gap || '1.5rem'};
`;

export const FlexRow = styled.div<{
  $gap?: string;
  $align?: string;
  $justify?: string;
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: row;
  gap: ${({ $gap }) => $gap || '1rem'};
  align-items: ${({ $align }) => $align || 'center'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
`;

export const FlexColumn = styled.div<{
  $gap?: string;
  $align?: string;
  $justify?: string;
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap || '1rem'};
  align-items: ${({ $align }) => $align || 'stretch'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
`;

export default Layout;
