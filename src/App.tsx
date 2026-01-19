import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ExploreProvider } from './components/explore';
import { GlobalStyles } from './styles/GlobalStyles';
import { ToastProvider } from './components/ui';

// Pages
import LandingPage from './pages/LandingPage';
import BuyerOffersPage from './pages/buyer/BuyerOffersPage';
import BuyerTrackingPage from './pages/buyer/BuyerTrackingPage';
import RequestsPage from './pages/buyer/RequestsPage';
import WalletPage from './pages/buyer/WalletPage';
import SellerDashboard from './pages/seller/SellerDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';
import { LoginPage, SignupPage } from './pages/auth';
import { DashboardPage } from './pages/dashboard';
import { ExplorePage } from './pages/explore';
import { OnboardingPage } from './pages/onboarding';
import { ProtectedRoute } from './routes';
import { 
  ManageProductsPage, 
  BusinessHoursPage, 
  DeliveryAreasPage, 
  SettingsPage 
} from './pages/seller';

// Inner App with access to language context
const AppContent: React.FC = () => {
  const { isRTL } = useLanguage();

  return (
    <ToastProvider>
      <GlobalStyles isRTL={isRTL} />
      <Router>
        <Routes>
          {/* Landing / Home */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Onboarding for new users */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          
          {/* Explore / Search - available to all */}
          <Route path="/explore" element={<ExplorePage />} />
          
          {/* Buyer Routes - Protected */}
          <Route path="/buyer" element={
            <ProtectedRoute 
              element={<LandingPage />} 
              requiredRoles={['buyer']} 
            />
          } />
          <Route path="/buyer/offers" element={
            <ProtectedRoute 
              element={<BuyerOffersPage />} 
              requiredRoles={['buyer']} 
            />
          } />
          <Route path="/buyer/tracking" element={
            <ProtectedRoute 
              element={<BuyerTrackingPage />} 
              requiredRoles={['buyer']} 
            />
          } />
          <Route path="/buyer/tracking/:orderId" element={
            <ProtectedRoute 
              element={<BuyerTrackingPage />} 
              requiredRoles={['buyer']} 
            />
          } />
          
          {/* Seller Routes - Protected */}
          <Route path="/seller" element={
            <ProtectedRoute 
              element={<SellerDashboard />} 
              requiredRoles={['seller']} 
            />
          } />
          <Route path="/seller/dashboard" element={
            <ProtectedRoute 
              element={<SellerDashboard />} 
              requiredRoles={['seller']} 
            />
          } />
          <Route path="/seller/products" element={
            <ProtectedRoute 
              element={<ManageProductsPage />} 
              requiredRoles={['seller']} 
            />
          } />
          <Route path="/seller/business-hours" element={
            <ProtectedRoute 
              element={<BusinessHoursPage />} 
              requiredRoles={['seller']} 
            />
          } />
          <Route path="/seller/delivery-areas" element={
            <ProtectedRoute 
              element={<DeliveryAreasPage />} 
              requiredRoles={['seller']} 
            />
          } />
          <Route path="/seller/settings" element={
            <ProtectedRoute 
              element={<SettingsPage />} 
              requiredRoles={['seller']} 
            />
          } />
          
          {/* Driver Routes - Protected */}
          <Route path="/driver" element={
            <ProtectedRoute 
              element={<DriverDashboard />} 
              requiredRoles={['driver']} 
            />
          } />
          <Route path="/driver/dashboard" element={
            <ProtectedRoute 
              element={<DriverDashboard />} 
              requiredRoles={['driver']} 
            />
          } />
          
          {/* Browse - available to all */}
          <Route path="/browse" element={<ExplorePage />} />
          
          {/* Dashboard - Protected, any authenticated user */}
          <Route path="/dashboard" element={
            <ProtectedRoute element={<DashboardPage />} />
          } />

          {/* Requests - Protected */}
          <Route path="/requests" element={
            <ProtectedRoute element={<RequestsPage />} />
          } />

          {/* Wallet - Protected */}
          <Route path="/wallet" element={
            <ProtectedRoute element={<WalletPage />} />
          } />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <ExploreProvider>
            <AppContent />
          </ExploreProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
