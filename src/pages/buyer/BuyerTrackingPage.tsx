import styled from 'styled-components';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Layout, Container } from '../../components/layout';
import { Card, Button, Badge } from '../../components/ui';
import { useLanguage } from '../../context/LanguageContext';
import {
  Package,
  MapPin,
  Clock,
  Check,
  Phone,
  MessageCircle,
  Navigation,
  User,
  Truck,
} from 'lucide-react';

// Order tracking stages
const stages = [
  { key: 'confirmed', icon: Check, label: { fr: 'Confirmé', ar: 'مؤكد' } },
  { key: 'preparing', icon: Package, label: { fr: 'Préparation', ar: 'قيد التحضير' } },
  { key: 'onway', icon: Truck, label: { fr: 'En route', ar: 'في الطريق' } },
  { key: 'delivered', icon: MapPin, label: { fr: 'Livré', ar: 'تم التوصيل' } },
];

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg.primary};
`;

const TrackingHeader = styled.div`
  background: linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%);
  color: white;
  padding: 2rem 0 4rem;
`;

const HeaderContent = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderId = styled.div`
  font-size: 0.875rem;
  opacity: 0.8;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
`;

const ETA = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  
  svg {
    opacity: 0.8;
  }
`;

const TrackingContent = styled(Container)`
  margin-top: -2rem;
  padding-bottom: 2rem;
`;

const TrackingCard = styled(Card)`
  margin-bottom: 1.5rem;
`;

// Progress Steps
const ProgressSteps = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 1rem 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    height: 3px;
    background: ${({ theme }) => theme.colors.neutral.grayLighter};
    transform: translateY(-50%);
    z-index: 0;
  }
`;

const ProgressLine = styled(motion.div)<{ $progress: number }>`
  position: absolute;
  top: 50%;
  left: 10%;
  height: 3px;
  background: ${({ theme }) => theme.colors.primary.darkGreen};
  transform: translateY(-50%);
  z-index: 1;
  width: ${({ $progress }) => `${$progress}%`};
`;

const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
`;

const StepCircle = styled(motion.div)<{ $active: boolean; $completed: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $active, $completed }) =>
    $completed
      ? theme.colors.primary.darkGreen
      : $active
      ? theme.colors.secondary.gold
      : theme.colors.bg.secondary};
  border: 3px solid ${({ theme, $active, $completed }) =>
    $completed || $active
      ? 'transparent'
      : theme.colors.neutral.grayLighter};
  color: ${({ theme, $active, $completed }) =>
    $completed || $active ? 'white' : theme.colors.neutral.gray};
  transition: all 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const StepLabel = styled.span<{ $active: boolean }>`
  font-size: 0.75rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary.darkGreen : theme.colors.text.secondary};
  text-align: center;
  max-width: 80px;
`;

// Live Map Placeholder
const MapPlaceholder = styled.div`
  height: 200px;
  background: ${({ theme }) =>
    theme.mode === 'dark'
      ? 'linear-gradient(135deg, #2D2D2D 0%, #1B1B1B 100%)'
      : 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'};
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
`;

const MapPulse = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary.darkGreen};
  opacity: 0.3;
  position: absolute;
`;

const DeliveryIcon = styled(motion.div)`
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.colors.primary.darkGreen};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1;
  box-shadow: 0 4px 20px rgba(45, 106, 79, 0.3);
`;

const MapLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Order Details
const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
`;

const DetailValue = styled.span`
  font-weight: 500;
  text-align: right;
`;

// Contact Section
const ContactSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const ContactCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ContactIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ $color }) => $color}15;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContactLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const ContactName = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Actions
const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export const BuyerTrackingPage: React.FC = () => {
  const { language } = useLanguage();
  const [currentStage, setCurrentStage] = useState(2); // 0-3 for demo

  const getProgress = () => {
    return (currentStage / (stages.length - 1)) * 80; // 80% max to fit within padding
  };

  const orderData = {
    id: 'ZYN-2026-1234',
    eta: '15-20 min',
    seller: 'Restaurant Le Jardin',
    driver: 'Ahmed B.',
    address: 'Rue Didouche Mourad, Alger Centre',
    items: 'Couscous Royal, Salade, Boisson',
    total: 2500,
  };

  return (
    <Layout isLoggedIn showFooter={false}>
      <PageWrapper>
        <TrackingHeader>
          <HeaderContent>
            <OrderId>
              {language === 'ar' ? 'رقم الطلب' : 'Commande'} #{orderData.id}
            </OrderId>
            <PageTitle>
              {language === 'ar' ? 'تتبع طلبك' : 'Suivre votre commande'}
            </PageTitle>
            <ETA>
              <Clock size={20} />
              {language === 'ar' ? 'الوصول المتوقع:' : 'Arrivée estimée:'} {orderData.eta}
            </ETA>
          </HeaderContent>
        </TrackingHeader>

        <TrackingContent>
          {/* Live Map */}
          <MapPlaceholder>
            <MapPulse
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <DeliveryIcon
              animate={{
                y: [0, -5, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Truck size={28} />
            </DeliveryIcon>
            <MapLabel>
              {language === 'ar' ? 'الموقع المباشر' : 'Localisation en direct'}
            </MapLabel>
          </MapPlaceholder>

          {/* Progress Steps */}
          <TrackingCard padding="lg">
            <ProgressSteps>
              <ProgressLine
                $progress={getProgress()}
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.5 }}
              />
              {stages.map((stage, index) => (
                <Step
                  key={stage.key}
                  $active={index === currentStage}
                  $completed={index < currentStage}
                >
                  <StepCircle
                    $active={index === currentStage}
                    $completed={index < currentStage}
                    animate={
                      index === currentStage
                        ? { scale: [1, 1.1, 1] }
                        : {}
                    }
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <stage.icon />
                  </StepCircle>
                  <StepLabel $active={index === currentStage}>
                    {stage.label[language === 'ar' ? 'ar' : 'fr']}
                  </StepLabel>
                </Step>
              ))}
            </ProgressSteps>

            {/* Status Message */}
            <motion.div
              style={{
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(45, 106, 79, 0.1)',
                borderRadius: '0.75rem',
                marginTop: '1rem',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge variant="success">
                {language === 'ar' ? 'في الطريق إليك' : 'En route vers vous'}
              </Badge>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
                {language === 'ar'
                  ? 'السائق على بعد 1.2 كم منك'
                  : 'Le livreur est à 1.2 km de vous'}
              </p>
            </motion.div>
          </TrackingCard>

          {/* Order Details */}
          <TrackingCard>
            <h3 style={{ marginBottom: '1rem' }}>
              {language === 'ar' ? 'تفاصيل الطلب' : 'Détails de la commande'}
            </h3>
            <OrderDetails>
              <DetailRow>
                <DetailLabel>
                  <Package />
                  {language === 'ar' ? 'المنتجات' : 'Articles'}
                </DetailLabel>
                <DetailValue>{orderData.items}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>
                  <MapPin />
                  {language === 'ar' ? 'العنوان' : 'Adresse'}
                </DetailLabel>
                <DetailValue>{orderData.address}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>
                  <User />
                  {language === 'ar' ? 'البائع' : 'Vendeur'}
                </DetailLabel>
                <DetailValue>{orderData.seller}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel style={{ fontWeight: 600 }}>
                  {language === 'ar' ? 'المجموع' : 'Total'}
                </DetailLabel>
                <DetailValue style={{ color: '#FFC300', fontSize: '1.25rem', fontWeight: 700 }}>
                  {orderData.total.toLocaleString()} DA
                </DetailValue>
              </DetailRow>
            </OrderDetails>
          </TrackingCard>

          {/* Contact Section */}
          <h3 style={{ marginBottom: '1rem' }}>
            {language === 'ar' ? 'التواصل' : 'Contact'}
          </h3>
          <ContactSection>
            <ContactCard variant="outlined" hoverable>
              <ContactIcon $color="#2D6A4F">
                <Truck size={24} />
              </ContactIcon>
              <div>
                <ContactLabel>{orderData.driver}</ContactLabel>
                <ContactName>
                  {language === 'ar' ? 'السائق' : 'Livreur'}
                </ContactName>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <ContactIcon $color="#4D96FF" style={{ width: 36, height: 36 }}>
                  <Phone size={16} />
                </ContactIcon>
                <ContactIcon $color="#2D6A4F" style={{ width: 36, height: 36 }}>
                  <MessageCircle size={16} />
                </ContactIcon>
              </div>
            </ContactCard>

            <ContactCard variant="outlined" hoverable>
              <ContactIcon $color="#FFC300">
                <Package size={24} />
              </ContactIcon>
              <div>
                <ContactLabel>{orderData.seller}</ContactLabel>
                <ContactName>
                  {language === 'ar' ? 'البائع' : 'Vendeur'}
                </ContactName>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <ContactIcon $color="#4D96FF" style={{ width: 36, height: 36 }}>
                  <Phone size={16} />
                </ContactIcon>
                <ContactIcon $color="#2D6A4F" style={{ width: 36, height: 36 }}>
                  <MessageCircle size={16} />
                </ContactIcon>
              </div>
            </ContactCard>
          </ContactSection>

          {/* Action Buttons */}
          <ActionButtons>
            <Button variant="outline" fullWidth>
              <Navigation size={18} />
              {language === 'ar' ? 'فتح الخريطة' : 'Ouvrir la carte'}
            </Button>
            <Button variant="danger" fullWidth>
              {language === 'ar' ? 'الإبلاغ عن مشكلة' : 'Signaler un problème'}
            </Button>
          </ActionButtons>
        </TrackingContent>
      </PageWrapper>
    </Layout>
  );
};

export default BuyerTrackingPage;
