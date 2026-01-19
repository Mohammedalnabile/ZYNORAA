import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Container, Grid } from '../../components/layout';
import { Card, TrustScore, Button, Badge, LoadingState, EmptyState, ImageGallery, OfferThumbnail } from '../../components/ui';
import { PaymentModal } from '../../components/payment';
import { ProtectedFeature, RestrictedAction } from '../../components/access';
import { useExplore, getBuyerTour } from '../../components/explore';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import type { ProductImage } from '../../types';
import {
  Clock,
  MapPin,
  DollarSign,
  Check,
  X,
  Filter,
  ArrowUpDown,
  Star,
  Truck,
  MessageCircle,
  ChevronDown,
  Sparkles,
  CreditCard,
  Image as ImageIcon,
} from 'lucide-react';

const PageHeader = styled.div`
  padding: 2rem 0;
  background: ${({ theme }) =>
    theme.mode === 'dark'
      ? 'linear-gradient(180deg, rgba(45, 106, 79, 0.1) 0%, transparent 100%)'
      : 'linear-gradient(180deg, rgba(149, 213, 178, 0.2) 0%, transparent 100%)'};
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const RequestSummary = styled(Card)`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  
  svg {
    color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
`;

const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  align-items: center;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary.darkGreen : theme.colors.bg.secondary};
  color: ${({ theme, $active }) =>
    $active ? 'white' : theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary.darkGreenHover : theme.colors.bg.tertiary};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const OffersSection = styled.section`
  padding: 2rem 0;
`;

const OffersCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const CountText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  strong {
    color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
`;

const OffersGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Offer Card Component
const OfferCardWrapper = styled(motion.div)<{ $isNight?: boolean; $isSelected?: boolean }>`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1rem;
  padding: 1.5rem;
  border: 2px solid ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary.darkGreen : theme.colors.neutral.grayLighter};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${({ $isNight, theme }) =>
    $isNight &&
    `
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
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

const OfferHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SellerAvatar = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
`;

const SellerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SellerName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

const SellerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const OfferBadges = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const OfferBody = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: 1rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
`;

const OfferStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span<{ $highlight?: boolean; $large?: boolean }>`
  font-size: ${({ $large }) => ($large ? '1.75rem' : '1.25rem')};
  font-weight: 700;
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.secondary.gold : theme.colors.text.primary};
`;

const OfferNote = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  margin: 0.5rem 0;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: 0.5rem;
  
  &::before {
    content: '"';
  }
  
  &::after {
    content: '"';
  }
`;

const TrustScoreWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const OfferActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled(motion.button)<{ $variant: 'primary' | 'secondary' | 'outline' }>`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary.darkGreen};
          color: white;
          border: none;
          
          &:hover {
            background: ${theme.colors.primary.darkGreenHover};
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.secondary.mint};
          color: ${theme.colors.neutral.charcoal};
          border: none;
          
          &:hover {
            background: ${theme.colors.secondary.mintLight};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.text.primary};
          border: 2px solid ${theme.colors.neutral.grayLighter};
          
          &:hover {
            border-color: ${theme.colors.primary.darkGreen};
            color: ${theme.colors.primary.darkGreen};
          }
        `;
    }
  }}
`;

// Comparison Modal
const ComparisonModal = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
  z-index: 100;
`;

const ComparisonHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ComparisonTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
`;

const ComparisonGrid = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
`;

const ComparisonItem = styled.div<{ $selected?: boolean }>`
  min-width: 200px;
  padding: 1rem;
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary.darkGreen + '10' : theme.colors.bg.tertiary};
  border: 2px solid ${({ theme, $selected }) =>
    $selected ? theme.colors.primary.darkGreen : 'transparent'};
  border-radius: 0.75rem;
  text-align: center;
`;

interface Offer {
  id: string;
  seller: {
    name: string;
    type: 'store' | 'restaurant' | 'individual';
    verified: boolean;
  };
  price: number;
  deliveryTime: string;
  trustScore: number;
  note?: string;
  isNightOffer?: boolean;
  distance?: string;
  images: ProductImage[];
}

// Mock product images for demo
const mockProductImages: ProductImage[] = [
  {
    id: 'img1',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100',
    alt: 'Product image 1',
    order: 0,
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 'img2',
    url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    thumbnailUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100',
    alt: 'Product image 2',
    order: 1,
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 'img3',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    thumbnailUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100',
    alt: 'Product image 3',
    order: 2,
    uploadedAt: new Date().toISOString(),
  },
];

export const BuyerOffersPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { isNightMode } = useTheme();
  const { isLoggedIn } = useAuth();
  const { startExplore } = useExplore();
  const location = useLocation();
  const requestData = location.state || {};
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'trust' | 'time'>('price');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedOfferForPayment, setSelectedOfferForPayment] = useState<Offer | null>(null);
  const [expandedImageOffer, setExpandedImageOffer] = useState<string | null>(null);

  const handleExploreClick = () => {
    startExplore(getBuyerTour(t));
  };
  
  // Simulate loading offers
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffers([
        {
          id: '1',
          seller: { name: 'Marché Central', type: 'store', verified: true },
          price: 2500,
          deliveryTime: '30 min',
          trustScore: 92,
          note: 'Produits frais du jour, livraison express disponible',
          distance: '1.2 km',
          images: mockProductImages.slice(0, 2),
        },
        {
          id: '2',
          seller: { name: 'Boulangerie El-Amir', type: 'store', verified: true },
          price: 2200,
          deliveryTime: '45 min',
          trustScore: 87,
          distance: '2.5 km',
          images: [],
        },
        {
          id: '3',
          seller: { name: 'Restaurant Le Jardin', type: 'restaurant', verified: true },
          price: 3000,
          deliveryTime: '25 min',
          trustScore: 95,
          note: 'Préparation sur commande, ingrédients premium',
          isNightOffer: isNightMode,
          distance: '0.8 km',
          images: mockProductImages,
        },
        {
          id: '4',
          seller: { name: 'Karim Shop', type: 'individual', verified: false },
          price: 1800,
          deliveryTime: '60 min',
          trustScore: 65,
          distance: '4.1 km',
          images: mockProductImages.slice(0, 1),
        },
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isNightMode]);

  const handleSelectOffer = (id: string) => {
    setSelectedOffers(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const sortedOffers = [...offers].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'trust':
        return b.trustScore - a.trustScore;
      case 'time':
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      default:
        return 0;
    }
  });

  const getSellerColor = (type: string) => {
    switch (type) {
      case 'store':
        return '#2D6A4F';
      case 'restaurant':
        return '#FFC300';
      case 'individual':
        return '#4D96FF';
      default:
        return '#6B7280';
    }
  };

  return (
    <Layout showFooter={false} onExploreClick={handleExploreClick}>
      <PageHeader>
        <Container>
          <HeaderContent>
            <PageTitle>
              <Sparkles size={28} />
              {t('buyer.offers.title')}
            </PageTitle>
            
            {requestData.request && (
              <RequestSummary padding="md">
                <SummaryItem>
                  <strong>{language === 'ar' ? 'طلبك:' : 'Votre demande:'}</strong>
                  {requestData.request}
                </SummaryItem>
                {requestData.location && (
                  <SummaryItem>
                    <MapPin size={16} />
                    {requestData.location}
                  </SummaryItem>
                )}
                {requestData.time && (
                  <SummaryItem>
                    <Clock size={16} />
                    {requestData.time}
                  </SummaryItem>
                )}
                {requestData.budget && (
                  <SummaryItem>
                    <DollarSign size={16} />
                    {requestData.budget} DA
                  </SummaryItem>
                )}
              </RequestSummary>
            )}

            <FiltersBar>
              <FilterButton
                $active={sortBy === 'price'}
                onClick={() => setSortBy('price')}
              >
                <ArrowUpDown size={16} />
                {language === 'ar' ? 'السعر' : 'Prix'}
              </FilterButton>
              <FilterButton
                $active={sortBy === 'trust'}
                onClick={() => setSortBy('trust')}
              >
                <Star size={16} />
                {language === 'ar' ? 'الثقة' : 'Confiance'}
              </FilterButton>
              <FilterButton
                $active={sortBy === 'time'}
                onClick={() => setSortBy('time')}
              >
                <Clock size={16} />
                {language === 'ar' ? 'الوقت' : 'Temps'}
              </FilterButton>
              <FilterButton>
                <Filter size={16} />
                {language === 'ar' ? 'فلترة' : 'Filtres'}
              </FilterButton>
            </FiltersBar>
          </HeaderContent>
        </Container>
      </PageHeader>

      <OffersSection>
        <Container>
          {loading ? (
            <LoadingState
              message={language === 'ar' ? 'جاري البحث عن أفضل العروض...' : 'Recherche des meilleures offres...'}
              variant="dots"
            />
          ) : offers.length === 0 ? (
            <EmptyState
              icon="📭"
              title={t('buyer.offers.empty')}
              description={language === 'ar'
                ? 'لم نجد عروض مطابقة لطلبك. جرب تعديل البحث.'
                : 'Aucune offre correspondante. Essayez de modifier votre recherche.'}
            />
          ) : (
            <>
              <OffersCount>
                <CountText>
                  <strong>{offers.length}</strong> {language === 'ar' ? 'عرض متاح' : 'offres disponibles'}
                </CountText>
                {selectedOffers.length > 0 && (
                  <FilterButton onClick={() => setShowComparison(true)}>
                    {language === 'ar' ? `مقارنة (${selectedOffers.length})` : `Comparer (${selectedOffers.length})`}
                  </FilterButton>
                )}
              </OffersCount>

              <OffersGrid>
                <AnimatePresence>
                  {sortedOffers.map((offer, index) => (
                    <OfferCardWrapper
                      key={offer.id}
                      $isNight={offer.isNightOffer}
                      $isSelected={selectedOffers.includes(offer.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSelectOffer(offer.id)}
                    >
                      <OfferHeader>
                        <SellerInfo>
                          {/* Product Image Thumbnail */}
                          {offer.images.length > 0 ? (
                            <OfferThumbnail
                              images={offer.images}
                              onClick={() => setExpandedImageOffer(
                                expandedImageOffer === offer.id ? null : offer.id
                              )}
                            />
                          ) : (
                            <SellerAvatar $color={getSellerColor(offer.seller.type)}>
                              {offer.seller.name.charAt(0)}
                            </SellerAvatar>
                          )}
                          <SellerDetails>
                            <SellerName>{offer.seller.name}</SellerName>
                            <SellerMeta>
                              {offer.seller.verified && (
                                <Badge variant="success" size="sm">
                                  <Check size={12} /> {language === 'ar' ? 'موثق' : 'Vérifié'}
                                </Badge>
                              )}
                              <span>{offer.distance}</span>
                              {offer.images.length > 0 && (
                                <Badge variant="info" size="sm">
                                  <ImageIcon size={10} /> {offer.images.length}
                                </Badge>
                              )}
                            </SellerMeta>
                          </SellerDetails>
                        </SellerInfo>
                        <OfferBadges>
                          {offer.isNightOffer && (
                            <Badge variant="night" size="sm">
                              🌙 {language === 'ar' ? 'عرض ليلي' : 'Nuit'}
                            </Badge>
                          )}
                        </OfferBadges>
                      </OfferHeader>

                      {/* Expanded Image Gallery */}
                      <AnimatePresence>
                        {expandedImageOffer === offer.id && offer.images.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ marginBottom: '1rem', overflow: 'hidden' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ImageGallery images={offer.images} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <OfferBody>
                        <OfferStat>
                          <StatLabel>{t('buyer.offers.price')}</StatLabel>
                          <StatValue $highlight $large>
                            {offer.price.toLocaleString()} DA
                          </StatValue>
                        </OfferStat>
                        <OfferStat>
                          <StatLabel>{t('buyer.offers.delivery')}</StatLabel>
                          <StatValue>
                            <Truck size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                            {offer.deliveryTime}
                          </StatValue>
                        </OfferStat>
                        <OfferStat>
                          <StatLabel>{t('buyer.offers.trust')}</StatLabel>
                          <TrustScoreWrapper>
                            <TrustScore score={offer.trustScore} size="sm" showLabel={false} />
                            <span style={{ fontWeight: 600 }}>{offer.trustScore}%</span>
                          </TrustScoreWrapper>
                        </OfferStat>
                      </OfferBody>

                      {offer.note && <OfferNote>{offer.note}</OfferNote>}

                      <OfferActions onClick={(e) => e.stopPropagation()}>
                        <ActionButton
                          $variant="outline"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <MessageCircle size={18} />
                          {language === 'ar' ? 'رسالة' : 'Message'}
                        </ActionButton>
                        <RestrictedAction>
                          <ActionButton
                            $variant="primary"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedOfferForPayment(offer);
                              setShowPayment(true);
                            }}
                          >
                            <CreditCard size={18} />
                            {language === 'ar' ? 'اختر و ادفع' : 'Choisir & Payer'}
                          </ActionButton>
                        </RestrictedAction>
                      </OfferActions>
                    </OfferCardWrapper>
                  ))}
                </AnimatePresence>
              </OffersGrid>
            </>
          )}
        </Container>
      </OffersSection>

      {/* Comparison Panel */}
      <AnimatePresence>
        {showComparison && selectedOffers.length > 0 && (
          <ComparisonModal
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <ComparisonHeader>
              <ComparisonTitle>
                {language === 'ar' ? 'مقارنة العروض' : 'Comparer les offres'}
              </ComparisonTitle>
              <ActionButton
                $variant="outline"
                style={{ flex: 'none', padding: '0.5rem' }}
                onClick={() => setShowComparison(false)}
              >
                <X size={20} />
              </ActionButton>
            </ComparisonHeader>
            <ComparisonGrid>
              {selectedOffers.map(id => {
                const offer = offers.find(o => o.id === id);
                if (!offer) return null;
                return (
                  <ComparisonItem key={id}>
                    <h4 style={{ marginBottom: '0.5rem' }}>{offer.seller.name}</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFC300' }}>
                      {offer.price.toLocaleString()} DA
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      {offer.deliveryTime} • {offer.trustScore}%
                    </p>
                  </ComparisonItem>
                );
              })}
            </ComparisonGrid>
            <ActionButton
              $variant="primary"
              style={{ marginTop: '1rem' }}
              whileHover={{ scale: 1.02 }}
            >
              {language === 'ar' ? 'اختيار الأفضل' : 'Choisir le meilleur'}
            </ActionButton>
          </ComparisonModal>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      {selectedOfferForPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => {
            setShowPayment(false);
            setSelectedOfferForPayment(null);
          }}
          orderId={`order_${selectedOfferForPayment.id}`}
          amount={selectedOfferForPayment.price}
          onSuccess={(transactionId) => {
            console.log('Payment successful:', transactionId);
            // Navigate to tracking or show success
          }}
          onError={(error) => {
            console.error('Payment failed:', error);
          }}
        />
      )}
    </Layout>
  );
};

export default BuyerOffersPage;
