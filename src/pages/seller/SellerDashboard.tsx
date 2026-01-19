import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Container } from '../../components/layout';
import { Card, TrustScore, Button, Badge, Input, Textarea, ImageUpload } from '../../components/ui';
import { ProtectedFeature, RestrictedAction } from '../../components/access';
import { useExplore, getSellerTour } from '../../components/explore';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  CheckCircle,
  DollarSign,
  Clock,
  MapPin,
  User,
  Send,
  X,
  Package,
  AlertCircle,
  Eye,
  Settings,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';

const DashboardWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg.primary};
`;

const DashboardHeader = styled.div`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gold.bronze};
  padding: 1.5rem 0;
`;

const HeaderContent = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const WelcomeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 1rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.gold.bronze} 0%, ${({ theme }) => theme.colors.gold.primary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-weight: 700;
  font-size: 1.5rem;
`;

const WelcomeText = styled.div``;

const Greeting = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const ShopName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const HeaderStats = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StatBox = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gold.primary};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const DashboardContent = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

// Tab Navigation
const TabNav = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.gold.primary : theme.colors.bg.secondary};
  color: ${({ theme, $active }) => ($active ? (theme.mode === 'dark' ? '#1A1A1A' : '#FFFFFF') : theme.colors.text.primary)};
  border: 1px solid ${({ theme, $active }) =>
    $active ? theme.colors.gold.primary : theme.colors.gold.bronze};
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.gold.hover : theme.colors.bg.tertiary};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const TabBadge = styled.span<{ $variant?: 'default' | 'warning' | 'success' }>`
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $variant }) => {
    switch ($variant) {
      case 'warning':
        return '#FFC300';
      case 'success':
        return '#10B981';
      default:
        return 'rgba(255,255,255,0.2)';
    }
  }};
  color: ${({ $variant }) => ($variant === 'default' ? 'inherit' : '#333')};
`;

// Request Cards
const RequestsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RequestCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.card.bg};
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.card.border};
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    border-color: ${({ theme }) => theme.colors.gold.primary};
  }
`;

const RequestHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const RequestInfo = styled.div`
  flex: 1;
`;

const RequestTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const RequestMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.gold.primary};
  }
`;

const BudgetBadge = styled.div`
  background: ${({ theme }) => theme.colors.gold.light}20;
  color: ${({ theme }) => theme.colors.gold.primary};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1.125rem;
`;

const RequestBody = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 1rem 0;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: 0.5rem;
`;

const RequestActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

// Offer Form Modal
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &:hover {
    background: ${({ theme }) => theme.colors.neutral.grayLighter};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

// Escrow types
type EscrowStatusType = 'pending' | 'released' | 'disputed';

// Escrow Card
const EscrowCard = styled(RequestCard)`
  border-left: 4px solid ${({ theme }) => theme.colors.secondary.gold};
`;

const EscrowStatus = styled.div<{ $status: EscrowStatusType }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'pending':
        return `
          background: ${theme.colors.secondary.gold}20;
          color: ${theme.colors.secondary.goldDark};
        `;
      case 'released':
        return `
          background: ${theme.colors.status.success}20;
          color: ${theme.colors.status.success};
        `;
      case 'disputed':
        return `
          background: ${theme.colors.accent.alertRed}20;
          color: ${theme.colors.accent.alertRed};
        `;
    }
  }}
`;

// Mock data
const mockRequests = [
  {
    id: '1',
    title: 'Couscous pour 10 personnes',
    description: 'Besoin d\'un couscous royal avec légumes frais pour un événement familial. Poulet et agneau préférés.',
    budget: '5000-7000',
    location: 'Alger Centre',
    deadline: '15:00 aujourd\'hui',
    customer: { name: 'Amina K.', trustScore: 88 },
    createdAt: '10 min',
  },
  {
    id: '2',
    title: 'Pizza party - 5 grandes pizzas',
    description: 'Variété de pizzas: Margherita, 4 fromages, Végétarienne, Viande, Fruits de mer',
    budget: '3500-4500',
    location: 'Bab El Oued',
    deadline: '19:00 aujourd\'hui',
    customer: { name: 'Youcef M.', trustScore: 95 },
    createdAt: '25 min',
  },
];

const mockAccepted = [
  {
    id: '1',
    title: 'Tajine poulet aux olives',
    status: 'preparing',
    customer: 'Fatima B.',
    price: 2200,
    deliveryTime: '45 min',
  },
];

const mockEscrow: {
  id: string;
  title: string;
  amount: number;
  status: EscrowStatusType;
  date: string;
  releaseDate: string;
}[] = [
  {
    id: '1',
    title: 'Commande #ZYN-1234',
    amount: 3500,
    status: 'pending',
    date: '18 Jan 2026',
    releaseDate: '20 Jan 2026',
  },
  {
    id: '2',
    title: 'Commande #ZYN-1189',
    amount: 2200,
    status: 'released',
    date: '15 Jan 2026',
    releaseDate: '17 Jan 2026',
  },
];

export const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { isNightMode } = useTheme();
  const { isLoggedIn } = useAuth();
  const { startExplore } = useExplore();
  const [activeTab, setActiveTab] = useState<'requests' | 'accepted' | 'escrow'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerTime, setOfferTime] = useState('');
  const [offerNote, setOfferNote] = useState('');
  const [offerImages, setOfferImages] = useState<any[]>([]);

  const handleExploreClick = () => {
    startExplore(getSellerTour(t));
  };

  const handleSubmitOffer = () => {
    // Get uploaded image URLs
    const imageUrls = offerImages
      .filter((img) => img.status === 'completed' && img.uploadedImage)
      .map((img) => img.uploadedImage.url);
    
    console.log('Submitting offer:', { 
      offerPrice, 
      offerTime, 
      offerNote,
      images: imageUrls,
    });
    
    setSelectedRequest(null);
    setOfferPrice('');
    setOfferTime('');
    setOfferNote('');
    setOfferImages([]);
  };

  const handleImagesChange = useCallback((images: any[]) => {
    setOfferImages(images);
  }, []);

  const tabs = [
    {
      key: 'requests' as const,
      label: language === 'ar' ? 'الطلبات الواردة' : 'Demandes entrantes',
      icon: <FileText />,
      count: mockRequests.length,
      badgeVariant: 'warning' as const,
    },
    {
      key: 'accepted' as const,
      label: language === 'ar' ? 'العروض المقبولة' : 'Offres acceptées',
      icon: <CheckCircle />,
      count: mockAccepted.length,
      badgeVariant: 'success' as const,
    },
    {
      key: 'escrow' as const,
      label: language === 'ar' ? 'المدفوعات المحجوزة' : 'Paiements Escrow',
      icon: <DollarSign />,
      count: mockEscrow.length,
      badgeVariant: 'default' as const,
    },
  ];

  return (
    <Layout showFooter={false} onExploreClick={handleExploreClick}>
      <DashboardWrapper>
        <ProtectedFeature featureName={language === 'ar' ? 'لوحة تحكم البائع' : 'Tableau de bord vendeur'}>
        <DashboardHeader>
          <HeaderContent>
            <WelcomeSection>
              <Avatar>R</Avatar>
              <WelcomeText>
                <Greeting>
                  {isNightMode
                    ? language === 'ar'
                      ? 'مساء الخير'
                      : 'Bonsoir'
                    : language === 'ar'
                    ? 'مرحباً'
                    : 'Bonjour'}
                </Greeting>
                <ShopName>Restaurant Le Jardin</ShopName>
              </WelcomeText>
            </WelcomeSection>

            <HeaderStats>
              <StatBox>
                <StatValue>12</StatValue>
                <StatLabel>
                  {language === 'ar' ? 'طلبات اليوم' : 'Demandes aujourd\'hui'}
                </StatLabel>
              </StatBox>
              <StatBox>
                <StatValue>8</StatValue>
                <StatLabel>
                  {language === 'ar' ? 'عروض مرسلة' : 'Offres envoyées'}
                </StatLabel>
              </StatBox>
              <StatBox>
                <StatValue style={{ color: '#FFC300' }}>45,000</StatValue>
                <StatLabel>
                  {language === 'ar' ? 'أرباح الأسبوع' : 'Gains cette semaine'}
                </StatLabel>
              </StatBox>
            </HeaderStats>
          </HeaderContent>
        </DashboardHeader>

        <DashboardContent>
          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<Package size={16} />}
              onClick={() => navigate('/seller/products')}
            >
              {language === 'ar' ? 'إدارة المنتجات' : 'Gérer produits'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<Calendar size={16} />}
              onClick={() => navigate('/seller/business-hours')}
            >
              {language === 'ar' ? 'ساعات العمل' : 'Horaires'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<MapPin size={16} />}
              onClick={() => navigate('/seller/delivery-areas')}
            >
              {language === 'ar' ? 'مناطق التوصيل' : 'Zones de livraison'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<Settings size={16} />}
              onClick={() => navigate('/seller/settings')}
            >
              {language === 'ar' ? 'الإعدادات' : 'Paramètres'}
            </Button>
          </div>

          {/* Tabs */}
          <TabNav>
            {tabs.map(tab => (
              <Tab
                key={tab.key}
                $active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                {tab.label}
                <TabBadge $variant={activeTab === tab.key ? 'default' : tab.badgeVariant}>
                  {tab.count}
                </TabBadge>
              </Tab>
            ))}
          </TabNav>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'requests' && (
              <RequestsGrid
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {mockRequests.map((request, index) => (
                  <RequestCard
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RequestHeader>
                      <RequestInfo>
                        <RequestTitle>{request.title}</RequestTitle>
                        <RequestMeta>
                          <MetaItem>
                            <MapPin />
                            {request.location}
                          </MetaItem>
                          <MetaItem>
                            <Clock />
                            {request.deadline}
                          </MetaItem>
                          <MetaItem>
                            <User />
                            {request.customer.name}
                          </MetaItem>
                          <Badge variant="info" size="sm">
                            {request.createdAt}
                          </Badge>
                        </RequestMeta>
                      </RequestInfo>
                      <BudgetBadge>{request.budget} DA</BudgetBadge>
                    </RequestHeader>

                    <RequestBody>{request.description}</RequestBody>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        {language === 'ar' ? 'درجة ثقة العميل:' : 'Score client:'}
                      </span>
                      <TrustScore score={request.customer.trustScore} size="sm" variant="bar" showLabel={false} />
                    </div>

                    <RequestActions>
                      <Button variant="outline" size="sm" leftIcon={<Eye size={16} />}>
                        {language === 'ar' ? 'عرض التفاصيل' : 'Voir détails'}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Send size={16} />}
                        onClick={() => setSelectedRequest(request)}
                      >
                        {language === 'ar' ? 'تقديم عرض' : 'Soumettre offre'}
                      </Button>
                    </RequestActions>
                  </RequestCard>
                ))}
              </RequestsGrid>
            )}

            {activeTab === 'accepted' && (
              <RequestsGrid
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {mockAccepted.map((order, index) => (
                  <RequestCard
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RequestHeader>
                      <RequestInfo>
                        <RequestTitle>{order.title}</RequestTitle>
                        <RequestMeta>
                          <MetaItem>
                            <User />
                            {order.customer}
                          </MetaItem>
                          <MetaItem>
                            <Clock />
                            {order.deliveryTime}
                          </MetaItem>
                        </RequestMeta>
                      </RequestInfo>
                      <div style={{ textAlign: 'right' }}>
                        <BudgetBadge>{order.price.toLocaleString()} DA</BudgetBadge>
                        <Badge variant="warning" size="sm" style={{ marginTop: '0.5rem' }}>
                          {language === 'ar' ? 'قيد التحضير' : 'En préparation'}
                        </Badge>
                      </div>
                    </RequestHeader>

                    <RequestActions>
                      <Button variant="secondary" size="sm">
                        {language === 'ar' ? 'جاهز للاستلام' : 'Prêt pour ramassage'}
                      </Button>
                      <Button variant="outline" size="sm" leftIcon={<AlertCircle size={16} />}>
                        {language === 'ar' ? 'مشكلة' : 'Problème'}
                      </Button>
                    </RequestActions>
                  </RequestCard>
                ))}
              </RequestsGrid>
            )}

            {activeTab === 'escrow' && (
              <RequestsGrid
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {mockEscrow.map((escrow, index) => (
                  <EscrowCard
                    key={escrow.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RequestHeader>
                      <RequestInfo>
                        <RequestTitle>{escrow.title}</RequestTitle>
                        <RequestMeta>
                          <MetaItem>
                            <Calendar />
                            {escrow.date}
                          </MetaItem>
                          <MetaItem>
                            {escrow.status === 'released'
                              ? language === 'ar'
                                ? 'تم الإفراج'
                                : 'Libéré'
                              : language === 'ar'
                              ? `الإفراج: ${escrow.releaseDate}`
                              : `Libération: ${escrow.releaseDate}`}
                          </MetaItem>
                        </RequestMeta>
                      </RequestInfo>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFC300' }}>
                          {escrow.amount.toLocaleString()} DA
                        </div>
                        <EscrowStatus $status={escrow.status}>
                          {escrow.status === 'pending' && <Clock size={16} />}
                          {escrow.status === 'released' && <CheckCircle size={16} />}
                          {escrow.status === 'disputed' && <AlertCircle size={16} />}
                          {escrow.status === 'pending'
                            ? language === 'ar'
                              ? 'قيد الانتظار'
                              : 'En attente'
                            : escrow.status === 'released'
                            ? language === 'ar'
                              ? 'تم الإفراج'
                              : 'Libéré'
                            : language === 'ar'
                            ? 'نزاع'
                            : 'Litige'}
                        </EscrowStatus>
                      </div>
                    </RequestHeader>
                  </EscrowCard>
                ))}

                {/* Escrow Summary */}
                <Card variant="elevated" padding="lg" style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>
                        {language === 'ar' ? 'إجمالي المحجوز' : 'Total en Escrow'}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6B7280' }}>
                        {language === 'ar' ? 'سيتم الإفراج تلقائياً بعد تأكيد التسليم' : 'Sera libéré après confirmation de livraison'}
                      </p>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FFC300' }}>
                      3,500 DA
                    </div>
                  </div>
                </Card>
              </RequestsGrid>
            )}
          </AnimatePresence>
        </DashboardContent>
        </ProtectedFeature>
      </DashboardWrapper>

      {/* Offer Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRequest(null)}
          >
            <ModalContent
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  {language === 'ar' ? 'تقديم عرض' : 'Soumettre une offre'}
                </ModalTitle>
                <CloseButton onClick={() => setSelectedRequest(null)}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#F8F9FA', borderRadius: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{selectedRequest.title}</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6B7280' }}>
                  {language === 'ar' ? 'الميزانية:' : 'Budget:'} {selectedRequest.budget} DA
                </p>
              </div>

              <FormGroup>
                <Input
                  label={language === 'ar' ? 'سعرك (دج)' : 'Votre prix (DA)'}
                  type="number"
                  placeholder="0"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  leftIcon={<DollarSign size={18} />}
                />
              </FormGroup>

              <FormGroup>
                <Input
                  label={language === 'ar' ? 'وقت التحضير' : 'Temps de préparation'}
                  placeholder={language === 'ar' ? 'مثال: 30 دقيقة' : 'Ex: 30 minutes'}
                  value={offerTime}
                  onChange={(e) => setOfferTime(e.target.value)}
                  leftIcon={<Clock size={18} />}
                />
              </FormGroup>

              <FormGroup>
                <Textarea
                  label={language === 'ar' ? 'ملاحظة (اختياري)' : 'Note (optionnel)'}
                  placeholder={
                    language === 'ar'
                      ? 'أضف تفاصيل إضافية عن عرضك...'
                      : 'Ajoutez des détails sur votre offre...'
                  }
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                />
              </FormGroup>

              {/* Product Image Upload */}
              <FormGroup>
                <ImageUpload
                  images={offerImages}
                  onChange={handleImagesChange}
                  maxImages={5}
                />
              </FormGroup>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                leftIcon={<Send size={20} />}
                onClick={handleSubmitOffer}
              >
                {language === 'ar' ? 'إرسال العرض' : 'Envoyer l\'offre'}
              </Button>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default SellerDashboard;
