import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ZynoraMenu, LogoutConfirmModal } from '../menu';
import {
  Home,
  Search,
  FileText,
  Wallet,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  LogIn,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Store,
  Truck,
  Compass,
} from 'lucide-react';

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.nav.bg};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.nav.border};
`;

const HeaderContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.mode === 'dark' ? theme.colors.elegant.emeraldLight : theme.colors.elegant.emeraldDark};
  text-decoration: none;
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.elegant.emeraldDark} 0%, ${({ theme }) => theme.colors.elegant.emerald} 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-weight: bold;
  font-size: 1.25rem;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme, $isActive }) =>
    $isActive ? (theme.mode === 'dark' ? theme.colors.elegant.emeraldLight : theme.colors.elegant.emeraldDark) : theme.colors.text.secondary};
  background: ${({ theme, $isActive }) =>
    $isActive ? (theme.mode === 'dark' ? theme.colors.elegant.emerald + '20' : theme.colors.elegant.emerald + '15') : 'transparent'};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.nav.linkHoverBg};
    color: ${({ theme }) => theme.mode === 'dark' ? theme.colors.elegant.emeraldLight : theme.colors.elegant.emeraldDark};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bg.tertiary};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const LoginButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.elegant.emerald};
  color: #FFFFFF;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.elegant.emeraldDark};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled(IconButton)`
  display: none;

  @media (max-width: 768px) {
    display: flex;
  }
`;

// Mobile Menu
const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
`;

const MobileMenuPanel = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%;
  max-width: 320px;
  background: ${({ theme }) => theme.colors.bg.primary};
  z-index: 201;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const MobileNavLink = styled(NavLink)`
  padding: 0.75rem 1rem;
  font-size: 1rem;
`;

const MobileMenuFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.elegant.emerald + '30'};
`;

const LanguageToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border: none;
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
  cursor: pointer;
`;

const ExploreButtonStyled = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.elegant.emeraldDark} 0%, ${({ theme }) => theme.colors.elegant.emerald} 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.shadows.emeraldGlow};
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

interface HeaderProps {
  onExploreClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExploreClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { mode, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { isLoggedIn, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: t('nav.home'), icon: <Home /> },
    { path: '/browse', label: t('nav.browse'), icon: <Search /> },
    { path: '/buyer/offers', label: language === 'ar' ? 'شراء' : 'Acheter', icon: <ShoppingBag /> },
    { path: '/seller', label: language === 'ar' ? 'بيع' : 'Vendre', icon: <Store /> },
    { path: '/driver', label: language === 'ar' ? 'توصيل' : 'Livrer', icon: <Truck /> },
  ];

  if (isLoggedIn) {
    navItems.push(
      { path: '/dashboard', label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: <LayoutDashboard /> },
      { path: '/requests', label: t('nav.requests'), icon: <FileText /> },
      { path: '/wallet', label: t('nav.wallet'), icon: <Wallet /> }
    );
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async (remainAvailable: boolean) => {
    await logout(remainAvailable);
    setShowLogoutModal(false);
    navigate('/');
  };

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          {/* Zynora Menu Dropdown */}
          <ZynoraMenu onLogoutClick={handleLogoutClick} />

          <Nav>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                $isActive={location.pathname === item.path}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </Nav>

          <HeaderActions>
            {/* Explore Button */}
            {onExploreClick && (
              <ExploreButtonStyled onClick={onExploreClick}>
                <Compass />
                {t('explore.button')}
              </ExploreButtonStyled>
            )}
            
            <IconButton onClick={toggleTheme} aria-label="Toggle theme">
              {mode === 'light' ? <Moon /> : <Sun />}
            </IconButton>
            <IconButton onClick={toggleLanguage} aria-label="Toggle language">
              <Globe />
            </IconButton>
            
            {!isLoggedIn && (
              <LoginButton to="/login">
                <LogIn size={16} />
                {t('nav.login')}
              </LoginButton>
            )}

            <MobileMenuButton
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu />
            </MobileMenuButton>
          </HeaderActions>
        </HeaderContainer>
      </HeaderWrapper>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <MobileMenuOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileMenuPanel
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <MobileMenuHeader>
                <Logo to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <LogoIcon>Z</LogoIcon>
                  <span>Zynora</span>
                </Logo>
                <IconButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X />
                </IconButton>
              </MobileMenuHeader>

              <MobileNav>
                {navItems.map((item) => (
                  <MobileNavLink
                    key={item.path}
                    to={item.path}
                    $isActive={location.pathname === item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </MobileNavLink>
                ))}
              </MobileNav>

              <MobileMenuFooter>
                {onExploreClick && (
                  <LanguageToggle onClick={() => { setIsMobileMenuOpen(false); onExploreClick(); }}>
                    <Compass size={18} />
                    {t('explore.button')}
                  </LanguageToggle>
                )}
                
                <LanguageToggle onClick={toggleLanguage}>
                  <Globe size={18} />
                  {language === 'fr' ? 'العربية' : 'Français'}
                </LanguageToggle>
                
                <LanguageToggle onClick={toggleTheme}>
                  {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
                </LanguageToggle>

                {isLoggedIn ? (
                  <LanguageToggle onClick={() => { setIsMobileMenuOpen(false); handleLogoutClick(); }}>
                    <LogOut size={18} />
                    {t('nav.logout')}
                  </LanguageToggle>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      background: '#2D6A4F',
                      color: 'white',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      fontWeight: 500,
                      justifyContent: 'center',
                    }}
                  >
                    <LogIn size={18} />
                    {t('nav.login')}
                  </Link>
                )}
              </MobileMenuFooter>
            </MobileMenuPanel>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Header;