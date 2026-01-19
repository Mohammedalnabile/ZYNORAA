import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout, Container } from '../../components/layout';
import { Button } from '../../components/ui';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShoppingBag,
  Store,
  Truck,
  ChevronRight,
  Check,
  Sparkles,
  Shield,
  Zap,
  Clock,
  Star,
  MapPin,
  CreditCard,
  Users,
} from 'lucide-react';

// Types
interface Step {
  id: number;
  titleFr: string;
  titleAr: string;
  descFr: string;
  descAr: string;
  icon: React.ReactNode;
  color: string;
}

// Styled Components
const OnboardingWrapper = styled.div`
  min-height: calc(100vh - 200px);
  background: ${({ theme }) => theme.colors.bg.primary};
  padding: 2rem 0 4rem;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.darkGreen}10 0%,
    ${({ theme }) => theme.colors.secondary.mint}20 100%
  );
  border-radius: 2rem;
  margin-bottom: 3rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
  
  span {
    background: linear-gradient(135deg, #2D6A4F 0%, #95D5B2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SectionSubtitle = styled.p`
  font-size: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2.5rem;
`;

// How It Works Section
const StepsSection = styled.section`
  margin-bottom: 4rem;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

const StepCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1.5rem;
  padding: 2rem;
  width: 280px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary.darkGreen};
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StepDesc = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

// Roles Section
const RolesSection = styled.section`
  margin-bottom: 4rem;
`;

const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const RoleCard = styled(motion.div)<{ $color: string }>`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1.5rem;
  padding: 2rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ $color }) => $color};
    box-shadow: 0 12px 40px ${({ $color }) => $color}25;
  }
`;

const RoleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const RoleIcon = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  border-radius: 1rem;
  background: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const RoleInfo = styled.div`
  flex: 1;
`;

const RoleTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const RoleSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RoleFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RoleFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &:last-child {
    border-bottom: none;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
`;

const RoleButton = styled(Button)`
  width: 100%;
  margin-top: 1.5rem;
`;

// Features Section
const FeaturesSection = styled.section`
  margin-bottom: 4rem;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 2rem;
  padding: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  text-align: center;
  padding: 1.5rem;
`;

const FeatureIcon = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  border-radius: 1rem;
  background: ${({ $color }) => $color}15;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  
  svg {
    width: 28px;
    height: 28px;
  }
`;

const FeatureTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FeatureDesc = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

// CTA Section
const CTASection = styled.section`
  text-align: center;
  background: linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%);
  border-radius: 2rem;
  padding: 4rem 2rem;
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const CTADesc = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 500px;
  margin: 0 auto 2rem;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAButton = styled(Button)<{ $variant?: 'primary' | 'secondary' }>`
  background: ${({ $variant }) => ($variant === 'secondary' ? 'transparent' : 'white')};
  color: ${({ $variant }) => ($variant === 'secondary' ? 'white' : '#2D6A4F')};
  border: 2px solid ${({ $variant }) => ($variant === 'secondary' ? 'white' : 'transparent')};
  
  &:hover {
    background: ${({ $variant }) =>
      $variant === 'secondary' ? 'rgba(255,255,255,0.1)' : '#f0f0f0'};
  }
`;

// Component
export const OnboardingPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFr = language === 'fr';

  const steps: Step[] = [
    {
      id: 1,
      titleFr: 'Create Account',
      titleAr: 'إنشاء حساب',
      descFr: 'Sign up in seconds with your email or phone number.',
      descAr: 'سجل في ثوانٍ باستخدام بريدك الإلكتروني أو رقم هاتفك.',
      icon: <Users />,
      color: '#2D6A4F',
    },
    {
      id: 2,
      titleFr: 'Choose Your Role',
      titleAr: 'اختر دورك',
      descFr: 'Become a buyer, seller, or delivery driver.',
      descAr: 'كن مشتريًا أو بائعًا أو سائق توصيل.',
      icon: <Sparkles />,
      color: '#FFC300',
    },
    {
      id: 3,
      titleFr: 'Start Using',
      titleAr: 'ابدأ الاستخدام',
      descFr: 'Browse, sell, or deliver immediately.',
      descAr: 'تصفح أو بِع أو وصّل فورًا.',
      icon: <Zap />,
      color: '#95D5B2',
    },
  ];

  const roles = [
    {
      id: 'buyer',
      titleFr: 'Buyer',
      titleAr: 'مشتري',
      subtitleFr: 'Shop from verified sellers',
      subtitleAr: 'تسوق من البائعين المعتمدين',
      icon: <ShoppingBag />,
      color: '#2D6A4F',
      features: [
        { fr: 'Browse thousands of products', ar: 'تصفح آلاف المنتجات' },
        { fr: 'Compare prices and ratings', ar: 'قارن الأسعار والتقييمات' },
        { fr: 'Secure checkout', ar: 'دفع آمن' },
        { fr: 'Track orders in real-time', ar: 'تتبع الطلبات في الوقت الفعلي' },
        { fr: 'Leave reviews', ar: 'اترك تقييمات' },
      ],
    },
    {
      id: 'seller',
      titleFr: 'Seller',
      titleAr: 'بائع',
      subtitleFr: 'Grow your business online',
      subtitleAr: 'طوّر عملك عبر الإنترنت',
      icon: <Store />,
      color: '#FFC300',
      features: [
        { fr: 'List unlimited products', ar: 'أدرج منتجات غير محدودة' },
        { fr: 'Manage inventory easily', ar: 'إدارة المخزون بسهولة' },
        { fr: 'Track sales analytics', ar: 'تتبع تحليلات المبيعات' },
        { fr: 'Receive secure payments', ar: 'استلم مدفوعات آمنة' },
        { fr: 'Build your reputation', ar: 'ابنِ سمعتك' },
      ],
    },
    {
      id: 'driver',
      titleFr: 'Driver',
      titleAr: 'سائق',
      subtitleFr: 'Earn money delivering',
      subtitleAr: 'اكسب المال بالتوصيل',
      icon: <Truck />,
      color: '#95D5B2',
      features: [
        { fr: 'Flexible working hours', ar: 'ساعات عمل مرنة' },
        { fr: 'Accept deliveries you want', ar: 'اقبل التوصيلات التي تريدها' },
        { fr: 'Real-time navigation', ar: 'ملاحة في الوقت الفعلي' },
        { fr: 'Instant payments', ar: 'مدفوعات فورية' },
        { fr: 'Earn bonuses', ar: 'اكسب مكافآت' },
      ],
    },
  ];

  const features = [
    {
      titleFr: 'Secure Payments',
      titleAr: 'مدفوعات آمنة',
      descFr: 'Your transactions are protected with bank-level security.',
      descAr: 'معاملاتك محمية بأمان على مستوى البنوك.',
      icon: <CreditCard />,
      color: '#2D6A4F',
    },
    {
      titleFr: 'Verified Users',
      titleAr: 'مستخدمون موثقون',
      descFr: 'All sellers and drivers are verified for your safety.',
      descAr: 'جميع البائعين والسائقين موثقون لسلامتك.',
      icon: <Shield />,
      color: '#FFC300',
    },
    {
      titleFr: 'Fast Delivery',
      titleAr: 'توصيل سريع',
      descFr: 'Same-day delivery available in your area.',
      descAr: 'التوصيل في نفس اليوم متاح في منطقتك.',
      icon: <Clock />,
      color: '#95D5B2',
    },
    {
      titleFr: 'Real-time Tracking',
      titleAr: 'تتبع في الوقت الفعلي',
      descFr: 'Track your orders and deliveries live on the map.',
      descAr: 'تتبع طلباتك وتوصيلاتك مباشرة على الخريطة.',
      icon: <MapPin />,
      color: '#FF6B6B',
    },
    {
      titleFr: 'Trust Score',
      titleAr: 'درجة الثقة',
      descFr: 'Our rating system ensures quality and reliability.',
      descAr: 'نظام التقييم لدينا يضمن الجودة والموثوقية.',
      icon: <Star />,
      color: '#4ECDC4',
    },
    {
      titleFr: '24/7 Support',
      titleAr: 'دعم على مدار الساعة',
      descFr: 'Our team is always here to help you.',
      descAr: 'فريقنا دائمًا هنا لمساعدتك.',
      icon: <Users />,
      color: '#9B59B6',
    },
  ];

  return (
    <Layout onExploreClick={() => navigate('/explore')}>
      <OnboardingWrapper>
        <Container>
          {/* Hero Section */}
          <HeroSection>
            <HeroTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isFr ? (
                <>Welcome to <span>Zinora</span></>
              ) : (
                <><span>زينورا</span> مرحبًا بك في</>
              )}
            </HeroTitle>
            <HeroSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {isFr
                ? 'The multi-role marketplace connecting buyers, sellers, and delivery drivers. Start your journey today.'
                : 'السوق متعدد الأدوار الذي يربط المشترين والبائعين وسائقي التوصيل. ابدأ رحلتك اليوم.'}
            </HeroSubtitle>
            <HeroButtons
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button variant="primary" onClick={() => navigate('/signup')}>
                {isFr ? 'Get Started' : 'ابدأ الآن'}
                <ChevronRight size={18} />
              </Button>
              <Button variant="secondary" onClick={() => navigate('/explore')}>
                {isFr ? 'Explore First' : 'استكشف أولاً'}
              </Button>
            </HeroButtons>
          </HeroSection>

          {/* How It Works */}
          <StepsSection>
            <SectionTitle>{isFr ? 'How It Works' : 'كيف يعمل'}</SectionTitle>
            <SectionSubtitle>
              {isFr
                ? 'Get started in three simple steps'
                : 'ابدأ في ثلاث خطوات بسيطة'}
            </SectionSubtitle>
            <StepsContainer>
              {steps.map((step, index) => (
                <StepCard
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                >
                  <StepNumber>{step.id}</StepNumber>
                  <StepTitle>{isFr ? step.titleFr : step.titleAr}</StepTitle>
                  <StepDesc>{isFr ? step.descFr : step.descAr}</StepDesc>
                </StepCard>
              ))}
            </StepsContainer>
          </StepsSection>

          {/* Roles Section */}
          <RolesSection>
            <SectionTitle>{isFr ? 'Choose Your Role' : 'اختر دورك'}</SectionTitle>
            <SectionSubtitle>
              {isFr
                ? 'Select one or more roles to get started'
                : 'اختر دورًا واحدًا أو أكثر للبدء'}
            </SectionSubtitle>
            <RolesGrid>
              {roles.map((role, index) => (
                <RoleCard
                  key={role.id}
                  $color={role.color}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RoleHeader>
                    <RoleIcon $color={role.color}>{role.icon}</RoleIcon>
                    <RoleInfo>
                      <RoleTitle>{isFr ? role.titleFr : role.titleAr}</RoleTitle>
                      <RoleSubtitle>
                        {isFr ? role.subtitleFr : role.subtitleAr}
                      </RoleSubtitle>
                    </RoleInfo>
                  </RoleHeader>
                  <RoleFeatures>
                    {role.features.map((feature, i) => (
                      <RoleFeature key={i}>
                        <Check />
                        {isFr ? feature.fr : feature.ar}
                      </RoleFeature>
                    ))}
                  </RoleFeatures>
                  <RoleButton
                    variant="primary"
                    onClick={() => {
                      sessionStorage.setItem('selectedRole', role.id);
                      navigate('/signup');
                    }}
                  >
                    {isFr ? `Start as ${role.titleFr}` : `ابدأ كـ${role.titleAr}`}
                  </RoleButton>
                </RoleCard>
              ))}
            </RolesGrid>
          </RolesSection>

          {/* Features Section */}
          <FeaturesSection>
            <SectionTitle>{isFr ? 'Why Zinora?' : 'لماذا زينورا؟'}</SectionTitle>
            <SectionSubtitle>
              {isFr
                ? 'Everything you need in one platform'
                : 'كل ما تحتاجه في منصة واحدة'}
            </SectionSubtitle>
            <FeaturesGrid>
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <FeatureIcon $color={feature.color}>{feature.icon}</FeatureIcon>
                  <FeatureTitle>{isFr ? feature.titleFr : feature.titleAr}</FeatureTitle>
                  <FeatureDesc>{isFr ? feature.descFr : feature.descAr}</FeatureDesc>
                </FeatureCard>
              ))}
            </FeaturesGrid>
          </FeaturesSection>

          {/* CTA Section */}
          <CTASection>
            <CTATitle>
              {isFr ? 'Ready to Get Started?' : 'هل أنت مستعد للبدء؟'}
            </CTATitle>
            <CTADesc>
              {isFr
                ? 'Join thousands of users already on Zinora. Create your account now and start your journey.'
                : 'انضم إلى آلاف المستخدمين الموجودين بالفعل على زينورا. أنشئ حسابك الآن وابدأ رحلتك.'}
            </CTADesc>
            <CTAButtons>
              <CTAButton onClick={() => navigate('/signup')}>
                {isFr ? 'Create Account' : 'إنشاء حساب'}
                <ChevronRight size={18} />
              </CTAButton>
              <CTAButton $variant="secondary" onClick={() => navigate('/login')}>
                {isFr ? 'Sign In' : 'تسجيل الدخول'}
              </CTAButton>
            </CTAButtons>
          </CTASection>
        </Container>
      </OnboardingWrapper>
    </Layout>
  );
};

export default OnboardingPage;
