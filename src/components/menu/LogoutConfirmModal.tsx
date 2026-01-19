import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Wifi, WifiOff, AlertCircle, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 1.5rem;
  max-width: 420px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: ${({ theme }) => theme.colors.accent.alertRed};
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bg.tertiary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Message = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const WarningBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.secondary.gold}15;
  border: 1px solid ${({ theme }) => theme.colors.secondary.gold}40;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.secondary.gold};
    margin-top: 0.125rem;
  }
`;

const WarningText = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const OptionCard = styled.button<{ $isSelected: boolean; $variant: 'online' | 'offline' }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.25rem;
  background: ${({ $isSelected, $variant, theme }) =>
    $isSelected
      ? $variant === 'online'
        ? theme.colors.primary.darkGreen + '15'
        : theme.colors.accent.alertRed + '15'
      : theme.colors.bg.secondary};
  border: 2px solid
    ${({ $isSelected, $variant, theme }) =>
      $isSelected
        ? $variant === 'online'
          ? theme.colors.primary.darkGreen
          : theme.colors.accent.alertRed
        : 'transparent'};
  border-radius: 1rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $variant, theme }) =>
      $variant === 'online'
        ? theme.colors.primary.darkGreen + '10'
        : theme.colors.accent.alertRed + '10'};
  }
`;

const OptionIcon = styled.div<{ $variant: 'online' | 'offline' }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $variant, theme }) =>
    $variant === 'online'
      ? theme.colors.primary.darkGreen + '20'
      : theme.colors.neutral.grayLight};

  svg {
    color: ${({ $variant, theme }) =>
      $variant === 'online' ? theme.colors.primary.darkGreen : theme.colors.text.secondary};
  }
`;

const OptionContent = styled.div`
  flex: 1;
`;

const OptionTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const OptionDescription = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RadioIndicator = styled.div<{ $isSelected: boolean; $variant: 'online' | 'offline' }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid
    ${({ $isSelected, $variant, theme }) =>
      $isSelected
        ? $variant === 'online'
          ? theme.colors.primary.darkGreen
          : theme.colors.accent.alertRed
        : theme.colors.neutral.grayLight};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &::after {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ $isSelected, $variant, theme }) =>
      $isSelected
        ? $variant === 'online'
          ? theme.colors.primary.darkGreen
          : theme.colors.accent.alertRed
        : 'transparent'};
    transition: background 0.2s ease;
  }
`;

const Footer = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  background: ${({ theme }) => theme.colors.bg.secondary};
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
        background: ${theme.colors.accent.alertRed};
        color: white;

        &:hover {
          background: ${theme.colors.accent.alertRed}dd;
        }

        &:disabled {
          background: ${theme.colors.neutral.grayLight};
          cursor: not-allowed;
        }
      `
      : `
        background: ${theme.colors.bg.tertiary};
        color: ${theme.colors.text.primary};

        &:hover {
          background: ${theme.colors.neutral.grayLight};
        }
      `}
`;

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remainAvailable: boolean) => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedOption, setSelectedOption] = useState<'online' | 'offline' | null>(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  const isWorkerRole = user?.activeRole === 'seller' || user?.activeRole === 'driver';

  const handleConfirm = () => {
    if (selectedOption) {
      onConfirm(selectedOption === 'online');
    }
  };

  // If not a worker role, just show simple confirmation
  if (!isWorkerRole) {
    return (
      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <Modal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Header>
                <Title>
                  <LogOut size={20} />
                  {t('logout.title')}
                </Title>
                <CloseButton onClick={onClose}>
                  <X size={18} />
                </CloseButton>
              </Header>
              <Content>
                <Message>{t('logout.simpleMessage')}</Message>
              </Content>
              <Footer>
                <Button $variant="secondary" onClick={onClose}>
                  {t('common.cancel')}
                </Button>
                <Button $variant="primary" onClick={() => onConfirm(false)}>
                  <LogOut size={18} />
                  {t('nav.logout')}
                </Button>
              </Footer>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <Title>
                <LogOut size={20} />
                {t('logout.title')}
              </Title>
              <CloseButton onClick={onClose}>
                <X size={18} />
              </CloseButton>
            </Header>

            <Content>
              <Message>{t('logout.workerMessage')}</Message>

              <WarningBox>
                <AlertCircle size={18} />
                <WarningText>
                  {user?.activeRole === 'driver'
                    ? t('logout.driverWarning')
                    : t('logout.sellerWarning')}
                </WarningText>
              </WarningBox>

              <OptionsContainer>
                <OptionCard
                  $isSelected={selectedOption === 'online'}
                  $variant="online"
                  onClick={() => setSelectedOption('online')}
                >
                  <OptionIcon $variant="online">
                    <Wifi size={24} />
                  </OptionIcon>
                  <OptionContent>
                    <OptionTitle>{t('logout.stayAvailable')}</OptionTitle>
                    <OptionDescription>
                      {t('logout.stayAvailableDesc')}
                    </OptionDescription>
                  </OptionContent>
                  <RadioIndicator $isSelected={selectedOption === 'online'} $variant="online" />
                </OptionCard>

                <OptionCard
                  $isSelected={selectedOption === 'offline'}
                  $variant="offline"
                  onClick={() => setSelectedOption('offline')}
                >
                  <OptionIcon $variant="offline">
                    <WifiOff size={24} />
                  </OptionIcon>
                  <OptionContent>
                    <OptionTitle>{t('logout.goOffline')}</OptionTitle>
                    <OptionDescription>
                      {t('logout.goOfflineDesc')}
                    </OptionDescription>
                  </OptionContent>
                  <RadioIndicator $isSelected={selectedOption === 'offline'} $variant="offline" />
                </OptionCard>
              </OptionsContainer>
            </Content>

            <Footer>
              <Button $variant="secondary" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button
                $variant="primary"
                onClick={handleConfirm}
                disabled={!selectedOption}
              >
                <LogOut size={18} />
                {t('logout.confirm')}
              </Button>
            </Footer>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmModal;
