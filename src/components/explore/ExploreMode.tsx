import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb,
  MousePointer,
  Eye,
  Compass,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// ==================== Types ====================

export interface ExploreStep {
  id: string;
  target?: string; // CSS selector for element to highlight
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'scroll' | 'observe';
}

interface ExploreContextType {
  isExploreMode: boolean;
  currentStep: number;
  steps: ExploreStep[];
  startExplore: (steps: ExploreStep[]) => void;
  stopExplore: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
}

// ==================== Styled Components ====================

const ExploreOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 3000;
  pointer-events: all;
`;

const ExplorePanel = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  max-width: 480px;
  width: calc(100% - 2rem);
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 3001;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #2D6A4F 0%, #40916C 100%);
  color: white;
`;

const ExploreTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1rem;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PanelContent = styled.div`
  padding: 1.5rem;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StepDot = styled.button<{ $isActive: boolean; $isCompleted: boolean }>`
  width: ${({ $isActive }) => ($isActive ? '24px' : '10px')};
  height: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $isActive, $isCompleted, theme }) =>
    $isActive
      ? theme.colors.primary.darkGreen
      : $isCompleted
      ? theme.colors.secondary.mint
      : theme.colors.neutral.grayLight};
`;

const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
`;

const StepDescription = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const ActionHint = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.secondary.gold}15;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.secondary.gold};
    flex-shrink: 0;
  }
`;

const PanelFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  background: ${({ theme }) => theme.colors.bg.secondary};
`;

const NavButton = styled.button<{ $variant?: 'primary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
        background: ${theme.colors.primary.darkGreen};
        color: white;

        &:hover {
          background: ${theme.colors.primary.darkGreenHover};
        }
      `
      : `
        background: ${theme.colors.bg.tertiary};
        color: ${theme.colors.text.primary};

        &:hover {
          background: ${theme.colors.neutral.grayLight};
        }
      `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StepCounter = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

// Spotlight highlight for targeted elements
const Spotlight = styled(motion.div)<{ $rect: DOMRect | null }>`
  position: fixed;
  border: 3px solid ${({ theme }) => theme.colors.primary.darkGreen};
  border-radius: 0.75rem;
  box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.7);
  pointer-events: none;
  z-index: 3000;

  ${({ $rect }) =>
    $rect
      ? `
        top: ${$rect.top - 8}px;
        left: ${$rect.left - 8}px;
        width: ${$rect.width + 16}px;
        height: ${$rect.height + 16}px;
      `
      : `
        display: none;
      `}
`;

// ==================== Context ====================

const ExploreContext = createContext<ExploreContextType | undefined>(undefined);

export const useExplore = () => {
  const context = useContext(ExploreContext);
  if (!context) {
    throw new Error('useExplore must be used within an ExploreProvider');
  }
  return context;
};

// ==================== Provider ====================

interface ExploreProviderProps {
  children: ReactNode;
}

export const ExploreProvider: React.FC<ExploreProviderProps> = ({ children }) => {
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<ExploreStep[]>([]);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const { t } = useLanguage();

  const updateTargetRect = useCallback(() => {
    if (steps[currentStep]?.target) {
      const element = document.querySelector(steps[currentStep].target!);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [steps, currentStep]);

  React.useEffect(() => {
    if (isExploreMode) {
      updateTargetRect();
      window.addEventListener('resize', updateTargetRect);
      window.addEventListener('scroll', updateTargetRect);
      return () => {
        window.removeEventListener('resize', updateTargetRect);
        window.removeEventListener('scroll', updateTargetRect);
      };
    }
  }, [isExploreMode, updateTargetRect]);

  const startExplore = (newSteps: ExploreStep[]) => {
    setSteps(newSteps);
    setCurrentStep(0);
    setIsExploreMode(true);
  };

  const stopExplore = () => {
    setIsExploreMode(false);
    setCurrentStep(0);
    setSteps([]);
    setTargetRect(null);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      stopExplore();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
    }
  };

  const currentStepData = steps[currentStep];

  const getActionIcon = (action?: string) => {
    switch (action) {
      case 'click':
        return <MousePointer />;
      case 'scroll':
        return <ChevronRight />;
      case 'observe':
      default:
        return <Eye />;
    }
  };

  const getActionText = (action?: string): string => {
    switch (action) {
      case 'click':
        return t('explore.actionClick');
      case 'scroll':
        return t('explore.actionScroll');
      case 'observe':
      default:
        return t('explore.actionObserve');
    }
  };

  return (
    <ExploreContext.Provider
      value={{
        isExploreMode,
        currentStep,
        steps,
        startExplore,
        stopExplore,
        nextStep,
        prevStep,
        goToStep,
      }}
    >
      {children}

      <AnimatePresence>
        {isExploreMode && currentStepData && (
          <>
            {/* Spotlight for targeted element */}
            {targetRect && (
              <Spotlight
                $rect={targetRect}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layoutId="spotlight"
              />
            )}

            {/* If no target, show full overlay */}
            {!targetRect && (
              <ExploreOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}

            {/* Explore Panel */}
            <ExplorePanel
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <PanelHeader>
                <ExploreTitle>
                  <Compass />
                  {t('explore.modeTitle')}
                </ExploreTitle>
                <CloseButton onClick={stopExplore}>
                  <X />
                </CloseButton>
              </PanelHeader>

              <PanelContent>
                <StepIndicator>
                  {steps.map((_, index) => (
                    <StepDot
                      key={index}
                      $isActive={index === currentStep}
                      $isCompleted={index < currentStep}
                      onClick={() => goToStep(index)}
                    />
                  ))}
                </StepIndicator>

                <StepTitle>
                  <Lightbulb size={20} />
                  {currentStepData.title}
                </StepTitle>
                <StepDescription>{currentStepData.description}</StepDescription>

                {currentStepData.action && (
                  <ActionHint>
                    {getActionIcon(currentStepData.action)}
                    {getActionText(currentStepData.action)}
                  </ActionHint>
                )}
              </PanelContent>

              <PanelFooter>
                <NavButton onClick={prevStep} disabled={currentStep === 0}>
                  <ChevronLeft />
                  {t('explore.previous')}
                </NavButton>

                <StepCounter>
                  {currentStep + 1} / {steps.length}
                </StepCounter>

                <NavButton $variant="primary" onClick={nextStep}>
                  {currentStep === steps.length - 1 ? t('explore.finish') : t('explore.next')}
                  <ChevronRight />
                </NavButton>
              </PanelFooter>
            </ExplorePanel>
          </>
        )}
      </AnimatePresence>
    </ExploreContext.Provider>
  );
};

// ==================== Explore Button ====================

const ExploreButtonStyled = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #2D6A4F 0%, #40916C 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(45, 106, 79, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(45, 106, 79, 0.4);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

interface ExploreButtonProps {
  steps: ExploreStep[];
  className?: string;
}

export const ExploreButton: React.FC<ExploreButtonProps> = ({ steps, className }) => {
  const { startExplore } = useExplore();
  const { t } = useLanguage();

  return (
    <ExploreButtonStyled
      className={className}
      onClick={() => startExplore(steps)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Compass />
      {t('explore.button')}
    </ExploreButtonStyled>
  );
};

// ==================== Pre-defined Explore Tours ====================

export const getLandingPageTour = (t: (key: string) => string): ExploreStep[] => [
  {
    id: 'welcome',
    title: t('explore.landing.welcome.title'),
    description: t('explore.landing.welcome.desc'),
    position: 'center',
    action: 'observe',
  },
  {
    id: 'smart-request',
    target: '.smart-request-form',
    title: t('explore.landing.request.title'),
    description: t('explore.landing.request.desc'),
    position: 'bottom',
    action: 'observe',
  },
  {
    id: 'roles',
    title: t('explore.landing.roles.title'),
    description: t('explore.landing.roles.desc'),
    position: 'center',
    action: 'observe',
  },
  {
    id: 'trust',
    title: t('explore.landing.trust.title'),
    description: t('explore.landing.trust.desc'),
    position: 'center',
    action: 'observe',
  },
];

export const getBuyerTour = (t: (key: string) => string): ExploreStep[] => [
  {
    id: 'offers-list',
    title: t('explore.buyer.offers.title'),
    description: t('explore.buyer.offers.desc'),
    position: 'center',
    action: 'observe',
  },
  {
    id: 'compare',
    title: t('explore.buyer.compare.title'),
    description: t('explore.buyer.compare.desc'),
    position: 'center',
    action: 'observe',
  },
  {
    id: 'payment',
    title: t('explore.buyer.payment.title'),
    description: t('explore.buyer.payment.desc'),
    position: 'center',
    action: 'observe',
  },
];

export const getSellerTour = (t: (key: string) => string): ExploreStep[] => [
  {
    id: 'requests',
    title: t('explore.seller.requests.title'),
    description: t('explore.seller.requests.desc'),
    position: 'center',
    action: 'observe',
  },
  {
    id: 'submit-offer',
    title: t('explore.seller.offer.title'),
    description: t('explore.seller.offer.desc'),
    position: 'center',
    action: 'observe',
  },
  {
    id: 'escrow',
    title: t('explore.seller.escrow.title'),
    description: t('explore.seller.escrow.desc'),
    position: 'center',
    action: 'observe',
  },
];

export default ExploreProvider;
