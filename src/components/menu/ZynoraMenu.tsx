import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  Globe,
  Sun,
  Moon,
  ShoppingBag,
  Store,
  Truck,
  LogOut,
  ChevronDown,
  Check,
  Shield,
} from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const MenuContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const LogoButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bg.tertiary};
  }

  ${({ $isOpen, theme }) =>
    $isOpen &&
    `
    background: ${theme.colors.bg.tertiary};
  `}
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.gold.bronze} 0%, ${({ theme }) => theme.colors.gold.primary} 100%);\n  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-weight: bold;
  font-size: 1.25rem;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.darkGreen};
`;

const ChevronIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Dropdown = styled(motion.div)<{ $isRTL?: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  ${({ $isRTL }) => ($isRTL ? 'right: 0;' : 'left: 0;')}
  min-width: 280px;
  max-height: calc(100vh - 200px);
  background: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1000;

  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.neutral.grayLight} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral.grayLight};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => theme.colors.neutral.gray};
    }
  }
`;

const UserSection = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  background: ${({ theme }) => theme.colors.bg.secondary};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.gold.bronze} 0%, ${({ theme }) => theme.colors.gold.primary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 1.25rem;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary.darkGreen};
  margin-top: 0.25rem;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const MenuSection = styled.div`
  padding: 0.5rem;
`;

const SectionTitle = styled.div`
  padding: 0.5rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MenuItem = styled.button<{ $isActive?: boolean; $isDestructive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.secondary.mint + '30' : 'transparent'};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: left;
  color: ${({ $isDestructive, theme }) =>
    $isDestructive ? theme.colors.accent.alertRed : theme.colors.text.primary};
  font-size: 0.875rem;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $isDestructive, theme }) =>
      $isDestructive
        ? theme.colors.accent.alertRed + '15'
        : theme.colors.bg.tertiary};
  }

  svg {
    width: 18px;
    height: 18px;
    color: ${({ $isDestructive, $isActive, theme }) =>
      $isDestructive
        ? theme.colors.accent.alertRed
        : $isActive
        ? theme.colors.primary.darkGreen
        : theme.colors.text.secondary};
  }
`;

const MenuItemContent = styled.div`
  flex: 1;
`;

const MenuItemLabel = styled.div`
  font-weight: 500;
`;

const MenuItemHint = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.colors.bg.tertiary};
  }
`;

const ToggleLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ToggleSwitch = styled.button<{ $isActive: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary.darkGreen : theme.colors.neutral.grayLight};
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $isActive }) => ($isActive ? '22px' : '2px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: left 0.2s ease;
  }
`;

const RoleIcon: React.FC<{ role: UserRole }> = ({ role }) => {
  switch (role) {
    case 'buyer':
      return <ShoppingBag />;
    case 'seller':
      return <Store />;
    case 'driver':
      return <Truck />;
  }
};

interface ZynoraMenuProps {
  onLogoutClick: () => void;
}

export const ZynoraMenu: React.FC<ZynoraMenuProps> = ({ onLogoutClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user, isLoggedIn, updateRole } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    updateRole(role);
    setIsOpen(false);
    
    // Navigate to appropriate dashboard
    switch (role) {
      case 'buyer':
        navigate('/buyer/offers');
        break;
      case 'seller':
        navigate('/seller');
        break;
      case 'driver':
        navigate('/driver');
        break;
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogoutClick();
  };

  const roleLabels: Record<UserRole, { fr: string; ar: string }> = {
    buyer: { fr: 'Acheteur', ar: 'مشتري' },
    seller: { fr: 'Vendeur', ar: 'بائع' },
    driver: { fr: 'Livreur', ar: 'سائق' },
  };

  return (
    <MenuContainer ref={menuRef}>
      <LogoButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <LogoIcon>Z</LogoIcon>
        <LogoText>Zynora</LogoText>
        <ChevronIcon
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </ChevronIcon>
      </LogoButton>

      <AnimatePresence>
        {isOpen && (
          <Dropdown
            $isRTL={language === 'ar'}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {isLoggedIn && user ? (
              <>
                {/* User Info Section */}
                <UserSection>
                  <UserInfo>
                    <UserAvatar>
                      {user.name.charAt(0).toUpperCase()}
                    </UserAvatar>
                    <UserDetails>
                      <UserName>{user.name}</UserName>
                      <UserEmail>{user.email}</UserEmail>
                      <TrustBadge>
                        <Shield />
                        {t('buyer.offers.trust')}: {user.trustScore}%
                      </TrustBadge>
                    </UserDetails>
                  </UserInfo>
                </UserSection>

                {/* Profile & Settings */}
                <MenuSection>
                  <MenuItem onClick={handleProfileClick}>
                    <User />
                    <MenuItemContent>
                      <MenuItemLabel>{t('menu.profile')}</MenuItemLabel>
                      <MenuItemHint>{t('menu.profileHint')}</MenuItemHint>
                    </MenuItemContent>
                  </MenuItem>

                  <MenuItem onClick={() => { setIsOpen(false); navigate('/settings'); }}>
                    <Settings />
                    <MenuItemContent>
                      <MenuItemLabel>{t('menu.settings')}</MenuItemLabel>
                      <MenuItemHint>{t('menu.settingsHint')}</MenuItemHint>
                    </MenuItemContent>
                  </MenuItem>
                </MenuSection>

                {/* Role Selection */}
                <MenuSection>
                  <SectionTitle>{t('menu.switchRole')}</SectionTitle>
                  {user.roles.map((role) => (
                    <MenuItem
                      key={role}
                      $isActive={user.activeRole === role}
                      onClick={() => handleRoleChange(role)}
                    >
                      <RoleIcon role={role} />
                      <MenuItemContent>
                        <MenuItemLabel>
                          {language === 'fr' ? roleLabels[role].fr : roleLabels[role].ar}
                        </MenuItemLabel>
                      </MenuItemContent>
                      {user.activeRole === role && <Check size={16} />}
                    </MenuItem>
                  ))}
                </MenuSection>
              </>
            ) : (
              <MenuSection>
                <MenuItem onClick={() => { setIsOpen(false); navigate('/login'); }}>
                  <User />
                  <MenuItemContent>
                    <MenuItemLabel>{t('nav.login')}</MenuItemLabel>
                    <MenuItemHint>{t('menu.loginHint')}</MenuItemHint>
                  </MenuItemContent>
                </MenuItem>
              </MenuSection>
            )}

            {/* Preferences */}
            <MenuSection>
              <SectionTitle>{t('menu.preferences')}</SectionTitle>

              {/* Language Toggle */}
              <ToggleRow>
                <ToggleLabel>
                  <Globe />
                  {t('menu.language')}
                </ToggleLabel>
                <ToggleSwitch
                  $isActive={language === 'ar'}
                  onClick={toggleLanguage}
                  aria-label="Toggle language"
                />
              </ToggleRow>

              {/* Theme Toggle */}
              <ToggleRow>
                <ToggleLabel>
                  {mode === 'light' ? <Moon /> : <Sun />}
                  {t('menu.darkMode')}
                </ToggleLabel>
                <ToggleSwitch
                  $isActive={mode === 'dark'}
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                />
              </ToggleRow>
            </MenuSection>

            {/* Logout */}
            {isLoggedIn && (
              <MenuSection>
                <MenuItem $isDestructive onClick={handleLogout}>
                  <LogOut />
                  <MenuItemLabel>{t('nav.logout')}</MenuItemLabel>
                </MenuItem>
              </MenuSection>
            )}
          </Dropdown>
        )}
      </AnimatePresence>
    </MenuContainer>
  );
};

export default ZynoraMenu;
