import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

// Styled Components
const RestrictedWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
`;

const BlurredContent = styled.div<{ $blur: boolean }>`
  filter: ${({ $blur }) => ($blur ? 'blur(4px)' : 'none')};
  pointer-events: ${({ $blur }) => ($blur ? 'none' : 'auto')};
  user-select: ${({ $blur }) => ($blur ? 'none' : 'auto')};
  transition: filter 0.3s ease;
`;

const LockOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg.primary}cc;
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  padding: 2rem;
  z-index: 10;
`;

const LockIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;

  svg {
    width: 40px;
    height: 40px;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const LockTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
  text-align: center;
`;

const LockMessage = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  max-width: 280px;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const LoginButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: ${({ theme }) => theme.colors.primary.darkGreen};
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.darkGreenHover};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// Inline Lock Indicator (for small elements)
const InlineLockWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  cursor: not-allowed;

  svg {
    width: 16px;
    height: 16px;
  }
`;

// Feature Lock Badge
const FeatureBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.colors.secondary.gold}30;
  color: ${({ theme }) => theme.colors.secondary.gold};
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;

  svg {
    width: 10px;
    height: 10px;
  }
`;

// RestrictedAction wrapper - uses display: contents to not affect layout
const RestrictedActionWrapper = styled.div`
  display: contents;
`;

// Loading container for AccessGate
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Unauthorized container for AccessGate
const UnauthorizedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
  text-align: center;

  svg {
    color: ${({ theme }) => theme.colors.accent.alertRed};
  }

  h2 {
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
  }
`;

// ==================== Components ====================

interface ProtectedFeatureProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  fallback?: ReactNode;
  showOverlay?: boolean;
  featureName?: string;
}

/**
 * ProtectedFeature - Wraps content that requires authentication
 * Shows a lock overlay for unauthenticated users
 */
export const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({
  children,
  requiredRoles,
  fallback,
  showOverlay = true,
  featureName,
}) => {
  const { isLoggedIn, canAccess } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const hasAccess = isLoggedIn && canAccess(requiredRoles);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showOverlay) {
    return null;
  }

  return (
    <RestrictedWrapper>
      <BlurredContent $blur={true}>{children}</BlurredContent>
      <LockOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LockIcon
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Lock />
        </LockIcon>
        <LockTitle>{t('access.loginRequired')}</LockTitle>
        <LockMessage>
          {featureName
            ? t('access.featureRequiresLogin').replace('{feature}', featureName)
            : t('access.genericMessage')}
        </LockMessage>
        <LoginButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/login')}
        >
          <LogIn />
          {t('nav.login')}
        </LoginButton>
      </LockOverlay>
    </RestrictedWrapper>
  );
};

interface RestrictedActionProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  onUnauthorizedClick?: () => void;
}

/**
 * RestrictedAction - For buttons/actions that need auth
 * Disables interaction and shows tooltip for non-auth users
 */
export const RestrictedAction: React.FC<RestrictedActionProps> = ({
  children,
  requiredRoles,
  onUnauthorizedClick,
}) => {
  const { isLoggedIn, canAccess } = useAuth();
  const navigate = useNavigate();

  const hasAccess = isLoggedIn && canAccess(requiredRoles);

  const handleClick = (e: React.MouseEvent) => {
    if (!hasAccess) {
      e.preventDefault();
      e.stopPropagation();
      if (onUnauthorizedClick) {
        onUnauthorizedClick();
      } else {
        navigate('/login');
      }
    }
  };

  return (
    <RestrictedActionWrapper onClick={handleClick}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            disabled: !hasAccess,
            style: {
              ...(child.props.style || {}),
              opacity: hasAccess ? 1 : 0.6,
              cursor: hasAccess ? 'pointer' : 'not-allowed',
            },
          });
        }
        return child;
      })}
    </RestrictedActionWrapper>
  );
};

interface InlineLockProps {
  message?: string;
}

/**
 * InlineLock - Shows a small locked indicator
 * Use for compact UI areas
 */
export const InlineLock: React.FC<InlineLockProps> = ({ message }) => {
  const { t } = useLanguage();
  return (
    <InlineLockWrapper>
      <Lock />
      {message || t('access.loginToAccess')}
    </InlineLockWrapper>
  );
};

interface LockedBadgeProps {
  label?: string;
}

/**
 * LockedBadge - Small badge to indicate feature requires login
 */
export const LockedBadge: React.FC<LockedBadgeProps> = ({ label }) => {
  const { t } = useLanguage();
  return (
    <FeatureBadge>
      <Lock />
      {label || t('access.proFeature')}
    </FeatureBadge>
  );
};

interface AccessGateProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * AccessGate - Full page access control
 * Redirects unauthenticated users to login
 */
export const AccessGate: React.FC<AccessGateProps> = ({
  children,
  requiredRoles,
  redirectTo = '/login',
}) => {
  const { isLoggedIn, canAccess, isLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  React.useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate(redirectTo, { replace: true });
    }
  }, [isLoading, isLoggedIn, navigate, redirectTo]);

  if (isLoading) {
    return (
      <LoadingContainer>
        {t('common.loading')}
      </LoadingContainer>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  if (requiredRoles && !canAccess(requiredRoles)) {
    return (
      <UnauthorizedContainer>
        <AlertCircle size={48} />
        <h2>{t('access.unauthorized')}</h2>
        <p>{t('access.noRoleAccess')}</p>
      </UnauthorizedContainer>
    );
  }

  return <>{children}</>;
};

/**
 * useAccessControl - Hook for programmatic access checks
 */
export const useAccessControl = () => {
  const { isLoggedIn, canAccess, user } = useAuth();
  const navigate = useNavigate();

  const requireAuth = (callback: () => void) => {
    if (isLoggedIn) {
      callback();
    } else {
      navigate('/login');
    }
  };

  const requireRole = (roles: UserRole[], callback: () => void) => {
    if (isLoggedIn && canAccess(roles)) {
      callback();
    } else if (!isLoggedIn) {
      navigate('/login');
    }
  };

  return {
    isLoggedIn,
    canAccess,
    user,
    requireAuth,
    requireRole,
  };
};

export default ProtectedFeature;
