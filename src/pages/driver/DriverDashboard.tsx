import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Layout, Container } from '../../components/layout';
import { Card, TrustScore, Badge, Button } from '../../components/ui';
import { AvailabilityToggle } from '../../components/ui/Toggle';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  MapPin,
  Navigation,
  Clock,
  DollarSign,
  Truck,
  AlertTriangle,
  Star,
  TrendingUp,
  Moon,
  Sun,
  ChevronRight,
  Phone,
  MessageCircle,
  Check,
  X,
  Zap,
  Shield,
} from 'lucide-react';

const DashboardWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg.primary};
`;

// Map Area
const MapSection = styled.div<{ $isNight: boolean }>`
  position: relative;
  height: 45vh;
  min-height: 300px;
  background: ${({ $isNight }) =>
    $isNight
      ? 'linear-gradient(180deg, #1B1B1B 0%, #2D2D2D 100%)'
      : 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)'};
  overflow: hidden;
`;

const MapPlaceholder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const MapGrid = styled.div<{ $isNight: boolean }>`
  position: absolute;
  inset: 0;
  background-image: ${({ $isNight }) =>
    $isNight
      ? 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)'
      : 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)'};
  background-size: 30px 30px;
`;

const DriverMarker = styled(motion.div)`
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.colors.primary.darkGreen};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(45, 106, 79, 0.4);
  z-index: 2;
`;

const PulseRing = styled(motion.div)`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.primary.darkGreen};
  opacity: 0.5;
`;

// Request Markers
const RequestMarker = styled(motion.div)<{ $isNight: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  background: ${({ theme, $isNight }) =>
    $isNight ? theme.colors.secondary.gold : theme.colors.bg.secondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
  }
`;

// Top Bar with availability
const TopBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StatusCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NightModeIndicator = styled(motion.div)<{ $isNight: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme, $isNight }) =>
    $isNight ? theme.colors.secondary.gold : theme.colors.bg.secondary};
  color: ${({ theme, $isNight }) =>
    $isNight ? theme.colors.neutral.charcoal : theme.colors.text.primary};
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
`;

// Bottom Panel
const BottomPanel = styled(motion.div)`
  position: relative;
  z-index: 20;
  margin-top: -2rem;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
  padding: 1.5rem;
  min-height: 50vh;
`;

const PanelHandle = styled.div`
  width: 40px;
  height: 4px;
  background: ${({ theme }) => theme.colors.neutral.grayLighter};
  border-radius: 2px;
  margin: 0 auto 1.5rem;
`;

// Stats Row
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)<{ $highlight?: boolean }>`
  text-align: center;
  padding: 1rem;
  background: ${({ theme, $highlight }) =>
    $highlight ? `${theme.colors.secondary.gold}15` : theme.colors.bg.tertiary};
  border: ${({ theme, $highlight }) =>
    $highlight ? `2px solid ${theme.colors.secondary.gold}` : 'none'};
`;

const StatValue = styled.div<{ $color?: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $color, theme }) => $color || theme.colors.text.primary};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.25rem;
`;

// Request Cards
const RequestsTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DeliveryRequestCard = styled(motion.div)<{ $isNight?: boolean }>`
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  position: relative;
  overflow: hidden;
  
  ${({ $isNight, theme }) =>
    $isNight &&
    `
    border-color: ${theme.colors.secondary.gold};
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, ${theme.colors.secondary.gold}, ${theme.colors.accent.infoBlue});
    }
  `}
`;

const RequestTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const RequestDetails = styled.div`
  flex: 1;
`;

const RequestType = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RequestRoute = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0.25rem 0;
`;

const EarningBadge = styled.div<{ $bonus?: boolean }>`
  background: ${({ theme, $bonus }) =>
    $bonus ? theme.colors.secondary.gold : theme.colors.primary.darkGreen};
  color: ${({ theme, $bonus }) => ($bonus ? theme.colors.neutral.charcoal : 'white')};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BonusLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 500;
  opacity: 0.8;
`;

const RequestMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
`;

const SafetyIndicator = styled.div<{ $level: 'high' | 'medium' | 'low' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ $level, theme }) => {
    switch ($level) {
      case 'high':
        return `
          background: ${theme.colors.status.success}20;
          color: ${theme.colors.status.success};
        `;
      case 'medium':
        return `
          background: ${theme.colors.secondary.gold}20;
          color: ${theme.colors.secondary.goldDark};
        `;
      case 'low':
        return `
          background: ${theme.colors.accent.alertRed}20;
          color: ${theme.colors.accent.alertRed};
        `;
    }
  }}
`;

const RequestActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled(motion.button)<{ $variant: 'accept' | 'ignore' | 'info' }>`
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border: none;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'accept':
        return `
          background: ${theme.colors.primary.darkGreen};
          color: white;
          
          &:hover {
            background: ${theme.colors.primary.darkGreenHover};
          }
        `;
      case 'ignore':
        return `
          background: ${theme.colors.bg.tertiary};
          color: ${theme.colors.text.secondary};
          
          &:hover {
            background: ${theme.colors.neutral.grayLighter};
          }
        `;
      case 'info':
        return `
          background: transparent;
          border: 2px solid ${theme.colors.neutral.grayLighter};
          color: ${theme.colors.text.primary};
          flex: 0.5;
          
          &:hover {
            border-color: ${theme.colors.primary.darkGreen};
          }
        `;
    }
  }}
`;

// Trust Score Section
const TrustSection = styled(Card)`
  margin-top: 2rem;
`;

const TrustHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const TrustDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TrustIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: ${({ $color }) => $color}15;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TrustLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TrustValue = styled.div`
  font-weight: 600;
`;

// Mock data
const mockRequests = [
  {
    id: '1',
    type: 'Restaurant',
    pickup: 'Restaurant Le Jardin',
    dropoff: 'Rue Didouche Mourad',
    distance: '2.3 km',
    time: '~12 min',
    earning: 350,
    safetyLevel: 'high' as const,
    isNight: false,
  },
  {
    id: '2',
    type: 'Magasin',
    pickup: 'Marché Central',
    dropoff: 'Bab El Oued',
    distance: '4.1 km',
    time: '~20 min',
    earning: 450,
    bonus: 100,
    safetyLevel: 'high' as const,
    isNight: true,
  },
  {
    id: '3',
    type: 'Particulier',
    pickup: 'Hussein Dey',
    dropoff: 'El Harrach',
    distance: '5.8 km',
    time: '~25 min',
    earning: 520,
    safetyLevel: 'medium' as const,
    isNight: false,
  },
];

export const DriverDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { isNightMode } = useTheme();
  const [isAvailable, setIsAvailable] = useState(true);
  const [requests, setRequests] = useState(mockRequests);

  // Simulate real-time updates
  useEffect(() => {
    if (isAvailable) {
      const interval = setInterval(() => {
        // Could add new requests here
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isAvailable]);

  const handleAccept = (id: string) => {
    console.log('Accepting request:', id);
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleIgnore = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const todayEarnings = 2450;
  const weeklyEarnings = 18500;
  const trustScore = 87;
  const completedToday = 8;

  return (
    <Layout isLoggedIn showFooter={false}>
      <DashboardWrapper>
        {/* Map Section */}
        <MapSection $isNight={isNightMode}>
          <MapGrid $isNight={isNightMode} />
          
          {/* Mock request markers */}
          <RequestMarker
            $isNight={isNightMode}
            style={{ top: '30%', left: '20%' }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Truck size={20} />
          </RequestMarker>
          <RequestMarker
            $isNight={isNightMode}
            style={{ top: '50%', right: '25%' }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <Truck size={20} />
          </RequestMarker>
          <RequestMarker
            $isNight={isNightMode}
            style={{ bottom: '35%', left: '40%' }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Truck size={20} />
          </RequestMarker>

          <MapPlaceholder>
            <PulseRing
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <DriverMarker
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Navigation size={28} />
            </DriverMarker>
            <span style={{ fontSize: '0.875rem', color: isNightMode ? '#fff' : '#333', opacity: 0.7 }}>
              {language === 'ar' ? 'موقعك الحالي' : 'Votre position'}
            </span>
          </MapPlaceholder>

          {/* Top Bar */}
          <TopBar>
            <StatusCard padding="sm">
              <AvailabilityToggle
                isAvailable={isAvailable}
                onToggle={() => setIsAvailable(!isAvailable)}
              />
            </StatusCard>

            {isNightMode && (
              <NightModeIndicator
                $isNight={isNightMode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Moon size={16} />
                {language === 'ar' ? 'وضع الليل' : 'Mode nuit'}
                <Badge variant="gold" size="sm">+20%</Badge>
              </NightModeIndicator>
            )}
          </TopBar>
        </MapSection>

        {/* Bottom Panel */}
        <BottomPanel>
          <PanelHandle />

          {/* Stats Row */}
          <StatsRow>
            <StatCard>
              <StatValue $color="#FFC300">{todayEarnings.toLocaleString()}</StatValue>
              <StatLabel>
                {language === 'ar' ? 'أرباح اليوم (دج)' : "Gains aujourd'hui"}
              </StatLabel>
            </StatCard>
            <StatCard $highlight={isNightMode}>
              <StatValue>{completedToday}</StatValue>
              <StatLabel>
                {language === 'ar' ? 'توصيلات مكتملة' : 'Livraisons'}
              </StatLabel>
            </StatCard>
            <StatCard>
              <StatValue $color="#2D6A4F">{trustScore}%</StatValue>
              <StatLabel>
                {language === 'ar' ? 'درجة الثقة' : 'Score confiance'}
              </StatLabel>
            </StatCard>
          </StatsRow>

          {/* Requests */}
          <RequestsTitle>
            <SectionTitle>
              <Truck size={20} />
              {language === 'ar' ? 'الطلبات القريبة' : 'Demandes à proximité'}
            </SectionTitle>
            <Badge variant="info">{requests.length} {language === 'ar' ? 'متاحة' : 'disponibles'}</Badge>
          </RequestsTitle>

          <RequestsList>
            <AnimatePresence>
              {!isAvailable ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#6B7280',
                  }}
                >
                  <AlertTriangle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>
                    {language === 'ar'
                      ? 'أنت غير متاح حالياً. فعّل التوفر لاستقبال الطلبات.'
                      : "Vous n'êtes pas disponible. Activez pour recevoir des demandes."}
                  </p>
                </motion.div>
              ) : (
                requests.map((request, index) => (
                  <DeliveryRequestCard
                    key={request.id}
                    $isNight={request.isNight}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RequestTop>
                      <RequestDetails>
                        <RequestType>{request.type}</RequestType>
                        <RequestRoute>
                          {request.pickup} → {request.dropoff}
                        </RequestRoute>
                      </RequestDetails>
                      <EarningBadge $bonus={!!request.bonus}>
                        {(request.earning + (request.bonus || 0)).toLocaleString()} DA
                        {request.bonus && (
                          <BonusLabel>
                            +{request.bonus} {language === 'ar' ? 'مكافأة ليل' : 'bonus nuit'}
                          </BonusLabel>
                        )}
                      </EarningBadge>
                    </RequestTop>

                    <RequestMeta>
                      <MetaItem>
                        <MapPin />
                        {request.distance}
                      </MetaItem>
                      <MetaItem>
                        <Clock />
                        {request.time}
                      </MetaItem>
                      <SafetyIndicator $level={request.safetyLevel}>
                        <Shield size={14} />
                        {request.safetyLevel === 'high'
                          ? language === 'ar'
                            ? 'آمن'
                            : 'Sûr'
                          : request.safetyLevel === 'medium'
                          ? language === 'ar'
                            ? 'متوسط'
                            : 'Moyen'
                          : language === 'ar'
                          ? 'منخفض'
                          : 'Bas'}
                      </SafetyIndicator>
                      {request.isNight && (
                        <Badge variant="gold" size="sm">
                          <Moon size={12} /> {language === 'ar' ? 'ليلي' : 'Nuit'}
                        </Badge>
                      )}
                    </RequestMeta>

                    <RequestActions>
                      <ActionButton
                        $variant="info"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Phone size={18} />
                      </ActionButton>
                      <ActionButton
                        $variant="ignore"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleIgnore(request.id)}
                      >
                        <X size={18} />
                        {language === 'ar' ? 'تجاهل' : 'Ignorer'}
                      </ActionButton>
                      <ActionButton
                        $variant="accept"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAccept(request.id)}
                      >
                        <Check size={18} />
                        {language === 'ar' ? 'قبول' : 'Accepter'}
                      </ActionButton>
                    </RequestActions>
                  </DeliveryRequestCard>
                ))
              )}
            </AnimatePresence>
          </RequestsList>

          {/* Trust Score Section */}
          <TrustSection variant="outlined">
            <TrustHeader>
              <SectionTitle>
                <Star size={20} />
                {language === 'ar' ? 'درجة الثقة' : 'Score de Confiance'}
              </SectionTitle>
              <TrustScore score={trustScore} size="sm" />
            </TrustHeader>

            <TrustDetails>
              <TrustItem>
                <TrustIcon $color="#2D6A4F">
                  <Check size={20} />
                </TrustIcon>
                <div>
                  <TrustLabel>
                    {language === 'ar' ? 'توصيلات مكتملة' : 'Livraisons réussies'}
                  </TrustLabel>
                  <TrustValue>156</TrustValue>
                </div>
              </TrustItem>
              <TrustItem>
                <TrustIcon $color="#FFC300">
                  <Clock size={20} />
                </TrustIcon>
                <div>
                  <TrustLabel>
                    {language === 'ar' ? 'في الوقت' : 'À l\'heure'}
                  </TrustLabel>
                  <TrustValue>94%</TrustValue>
                </div>
              </TrustItem>
              <TrustItem>
                <TrustIcon $color="#4D96FF">
                  <Star size={20} />
                </TrustIcon>
                <div>
                  <TrustLabel>
                    {language === 'ar' ? 'تقييم العملاء' : 'Note clients'}
                  </TrustLabel>
                  <TrustValue>4.8/5</TrustValue>
                </div>
              </TrustItem>
              <TrustItem>
                <TrustIcon $color="#10B981">
                  <TrendingUp size={20} />
                </TrustIcon>
                <div>
                  <TrustLabel>
                    {language === 'ar' ? 'أرباح الأسبوع' : 'Gains semaine'}
                  </TrustLabel>
                  <TrustValue>{weeklyEarnings.toLocaleString()} DA</TrustValue>
                </div>
              </TrustItem>
            </TrustDetails>

            {/* Why this score */}
            <motion.div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(45, 106, 79, 0.1)',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <strong style={{ color: '#2D6A4F' }}>
                {language === 'ar' ? 'لماذا هذه الدرجة؟' : 'Pourquoi ce score?'}
              </strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#6B7280' }}>
                {language === 'ar'
                  ? 'درجتك تعتمد على: نسبة الإتمام، الوصول في الوقت، تقييمات العملاء، وعمر الحساب.'
                  : 'Votre score est basé sur: taux de complétion, ponctualité, avis clients, et ancienneté du compte.'}
              </p>
            </motion.div>
          </TrustSection>
        </BottomPanel>
      </DashboardWrapper>
    </Layout>
  );
};

export default DriverDashboard;
