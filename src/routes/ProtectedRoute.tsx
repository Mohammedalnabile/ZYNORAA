import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth, UserRole } from '../context/AuthContext';
import { Loader } from 'lucide-react';

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg.primary};
  
  svg {
    animation: spin 1s linear infinite;
    color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRoles?: UserRole[];
  fallback?: React.ReactElement;
}

/**
 * ProtectedRoute - Protects routes from unauthenticated access
 * 
 * Usage:
 * <Route path="/buyer" element={<ProtectedRoute element={<BuyerPage />} requiredRoles={['buyer']} />} />
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRoles,
  fallback,
}) => {
  const { isLoggedIn, canAccess, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <LoadingContainer>
        <Loader size={48} />
      </LoadingContainer>
    );
  }

  // If not logged in, redirect to login with return URL
  if (!isLoggedIn) {
    // Save the attempted URL for redirecting after login
    sessionStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If roles are required and user doesn't have access
  if (requiredRoles && !canAccess(requiredRoles)) {
    // Return custom fallback or redirect to unauthorized
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required roles
  return element;
};

export default ProtectedRoute;
