import styled from 'styled-components';
import { motion, useMotionValue } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Container } from '../components/layout';
import { Button, Input, Textarea } from '../components/ui';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useExplore, getLandingPageTour } from '../components/explore';
import { ProtectedFeature } from '../components/access';
import {
  MapPin,
  Clock,
  DollarSign,
  Send,
  ShoppingBag,
  Truck,
  Store,
  ArrowRight,
  Star,
  Shield,
  Zap,
} from 'lucide-react';

const HeroSection = styled.section`
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 0;
`;

const HeroBackground = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: -1;
  background: ${({ theme }) =>
    theme.mode === 'dark'
      ? 'radial-gradient(ellipse at top, rgba(46, 204, 155, 0.08) 0%, transparent 60%)'
      : 'radial-gradient(ellipse at top, rgba(46, 204, 155, 0.15) 0%, transparent 60%)'};
`;

const FloatingShape = styled(motion.div)<{ $size: number; $color: string }>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  opacity: 0.1;
  filter: blur(40px);
`;

const HeroContent = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
`;

const WelcomeBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.mode === 'dark' ? theme.colors.elegant.emerald + '12' : theme.colors.elegant.emerald + '15'};
  border: 1px solid ${({ theme }) => theme.colors.elegant.emerald};
  border-radius: 50px;
  color: ${({ theme }) => theme.mode === 'dark' ? theme.colors.elegant.emeraldLight : theme.colors.elegant.emeraldDark};
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  max-width: 800px;
  color: ${({ theme }) => theme.mode === 'dark' ? '#FDFCFB' : theme.colors.text.primary};
  
  span {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.elegant.emeraldDark} 0%, ${({ theme }) => theme.colors.elegant.emerald} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#D1CBC4' : theme.colors.text.secondary};
  max-width: 600px;
  line-height: 1.6;
`;

// Smart Request Card
const SmartRequestCard = styled(motion.div)`
  width: 100%;
  max-width: 700px;
  background: ${({ theme }) => theme.colors.card.bg};
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.large};
  border: 1px solid ${({ theme }) => theme.colors.card.border};
`;

const GetStartedSection = styled.section`
  padding: 5rem 0;
  background: ${({ theme }) => theme.colors.bg.primary};
`;

const RoleCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const RoleCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.card.bg};
  border-radius: 1.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${({ theme }) => theme.colors.card.border};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.elegant.emerald};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const RoleIconWrapper = styled.div<{ $color: string }>`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: ${({ $color }) => $color + '15'};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
`;

const RoleTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RoleDescription = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#9A9A9A' : theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const RoleButton = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.elegant.emerald};
  color: ${({ theme }) => theme.mode === 'dark' ? theme.colors.elegant.noir : '#FFFFFF'};
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.elegant.emeraldDark};
  }
`;

const RequestInputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const MainInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1.25rem;
  font-size: 1.125rem;
  border: 2px solid ${({ theme }) => theme.colors.input.border};
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.input.bg};
  color: ${({ theme }) => theme.colors.text.primary};
  resize: none;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gold.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.gold.light}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const OptionsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const OptionInput = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.elegant.emerald};
    width: 18px;
    height: 18px;
  }
  
  input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 2.75rem;
    border: 2px solid ${({ theme }) => theme.colors.input.border};
    border-radius: 0.75rem;
    font-size: 0.875rem;
    background: ${({ theme }) => theme.colors.input.bg};
    color: ${({ theme }) => theme.colors.text.primary};
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.elegant.emerald};
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.text.tertiary};
    }
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #FFFFFF;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.elegant.emerald} 0%, ${({ theme }) => theme.colors.elegant.emeraldDark} 100%);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.emeraldGlow};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Features Section
const FeaturesSection = styled.section`
  padding: 6rem 0;
  background: ${({ theme }) => theme.colors.bg.secondary};
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SectionSubtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.mode === 'dark' ? '#D1D1D1' : theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  padding: 2rem;
  background: ${({ theme }) => theme.colors.card.bg};
  border-radius: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.colors.card.border};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const FeatureIcon = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  background: ${({ $color }) => $color}20;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  
  svg {
    width: 28px;
    height: 28px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#9A9A9A' : theme.colors.text.secondary};
  font-size: 0.875rem;
  line-height: 1.6;
`;

// Roles Section
const RolesSection = styled.section`
  padding: 6rem 0;
`;

const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const RoleShowcaseCard = styled(motion.div)<{ $accentColor: string }>`
  position: relative;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $accentColor }) => $accentColor};
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  }
`;

const RoleIcon = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  margin-bottom: 1.5rem;
  background: ${({ $color }) => $color}15;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  
  svg {
    width: 28px;
    height: 28px;
  }
`;

const ShowcaseRoleTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ShowcaseRoleDescription = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#9A9A9A' : theme.colors.text.secondary};
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const RoleLink = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.elegant.emerald};
  font-weight: 600;
  font-size: 0.875rem;
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
`;

// Stats Section
const StatsSection = styled.section`
  padding: 4rem 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.elegant.noir} 0%, ${({ theme }) => theme.colors.elegant.noirSoft} 100%);
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StatItem = styled(motion.div)`
  padding: 1.5rem;
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.elegant.emerald};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#D1D1D1' : 'white'};
  opacity: 0.9;
`;

export const LandingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { isNightMode } = useTheme();
  const navigate = useNavigate();
  const { startExplore } = useExplore();
  const [request, setRequest] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [budget, setBudget] = useState('');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleExploreClick = () => {
    startExplore(getLandingPageTour(t));
  };

  const handleSubmit = () => {
    // Navigate to buyer offers page with request data
    navigate('/buyer/offers', { state: { request, location, time, budget } });
  };

  const features = [
    {
      icon: <Zap />,
      title: language === 'ar' ? 'طلبات ذكية' : 'Requêtes Intelligentes',
      description:
        language === 'ar'
          ? 'اوصف ما تحتاجه واستقبل عروض تنافسية من البائعين'
          : 'Décrivez ce dont vous avez besoin et recevez des offres concurrentielles',
      color: '#2ECC9B',
    },
    {
      icon: <Shield />,
      title: language === 'ar' ? 'نظام الضمان' : 'Système Escrow',
      description:
        language === 'ar'
          ? 'دفعات آمنة محمية حتى تستلم طلبك'
          : 'Paiements sécurisés protégés jusqu\'à réception de votre commande',
      color: '#B85C5C',
    },
    {
      icon: <Star />,
      title: language === 'ar' ? 'درجة الثقة' : 'Score de Confiance',
      description:
        language === 'ar'
          ? 'نظام تقييم شفاف يعتمد على السلوك الحقيقي'
          : 'Système de notation transparent basé sur le comportement réel',
      color: '#1FA676',
    },
  ];

  const roles = [
    {
      icon: <ShoppingBag />,
      title: language === 'ar' ? 'المشتري' : 'Acheteur',
      description:
        language === 'ar'
          ? 'أرسل طلبك واستقبل عروض من بائعين موثوقين. قارن واختر الأفضل.'
          : 'Envoyez votre demande et recevez des offres de vendeurs vérifiés. Comparez et choisissez.',
      color: '#2ECC9B',
      link: '/buyer',
    },
    {
      icon: <Store />,
      title: language === 'ar' ? 'البائع' : 'Vendeur',
      description:
        language === 'ar'
          ? 'استقبل طلبات العملاء وقدم عروضك. احصل على مدفوعات آمنة.'
          : 'Recevez les demandes clients et soumettez vos offres. Paiements sécurisés.',
      color: '#B85C5C',
      link: '/seller',
    },
    {
      icon: <Truck />,
      title: language === 'ar' ? 'السائق' : 'Livreur',
      description:
        language === 'ar'
          ? 'اختر الطلبات التي تناسبك. أرباح إضافية في الليل.'
          : 'Choisissez les livraisons qui vous conviennent. Bonus de nuit disponibles.',
      color: '#5C2A2A',
      link: '/driver',
    },
  ];

  return (
    <Layout onExploreClick={handleExploreClick}>
      {/* Hero Section */}
      <HeroSection>
        <HeroBackground
          animate={{
            background: isNightMode
              ? 'radial-gradient(ellipse at top, rgba(46, 204, 155, 0.08) 0%, transparent 60%)'
              : undefined,
          }}
        />
        
        {/* Floating animated shapes */}
        <FloatingShape
          $size={300}
          $color="#2ECC9B"
          style={{ top: '10%', left: '10%' }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <FloatingShape
          $size={200}
          $color="#B85C5C"
          style={{ bottom: '20%', right: '10%' }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {language === 'ar' ? (
              <>
                مرحباً بكم في <span>زينورا</span>
              </>
            ) : (
              <>
                Bienvenue sur <span>Zynora</span>
              </>
            )}
          </HeroTitle>

          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('landing.hero.subtitle')}
          </HeroSubtitle>

          {/* Smart Request Card */}
          <SmartRequestCard
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <RequestInputWrapper>
              <MainInput
                placeholder={t('landing.smartRequest.placeholder')}
                value={request}
                onChange={(e) => setRequest(e.target.value)}
              />
            </RequestInputWrapper>

            <OptionsRow>
              <OptionInput>
                <MapPin />
                <input
                  type="text"
                  placeholder={t('landing.smartRequest.location')}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </OptionInput>
              <OptionInput>
                <Clock />
                <input
                  type="text"
                  placeholder={t('landing.smartRequest.time')}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </OptionInput>
              <OptionInput>
                <DollarSign />
                <input
                  type="text"
                  placeholder={t('landing.smartRequest.budget')}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </OptionInput>
            </OptionsRow>

            <SubmitButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
            >
              <Send size={20} />
              {t('landing.smartRequest.submit')}
            </SubmitButton>
          </SmartRequestCard>
        </HeroContent>
      </HeroSection>

      {/* Get Started Section */}
      <GetStartedSection>
        <Container>
          <SectionTitle>
            {language === 'ar' ? 'ابدأ الآن' : 'Commencez Maintenant'}
          </SectionTitle>
          <SectionSubtitle>
            {language === 'ar'
              ? 'اختر دورك وانضم إلى منصة زينورا'
              : 'Choisissez votre rôle et rejoignez Zynora'}
          </SectionSubtitle>
          <RoleCardsGrid>
            <RoleCard
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/buyer/offers')}
            >
              <RoleIconWrapper $color="#2ECC9B">
                <ShoppingBag size={32} />
              </RoleIconWrapper>
              <RoleTitle>{language === 'ar' ? 'مشتري' : 'Acheteur'}</RoleTitle>
              <RoleDescription>
                {language === 'ar'
                  ? 'تصفح العروض واختر الأفضل لك'
                  : 'Parcourez les offres et choisissez la meilleure'}
              </RoleDescription>
              <RoleButton>
                {language === 'ar' ? 'تصفح العروض' : 'Voir les offres'}
                <ArrowRight size={18} />
              </RoleButton>
            </RoleCard>

            <RoleCard
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/seller')}
            >
              <RoleIconWrapper $color="#B85C5C">
                <Store size={32} />
              </RoleIconWrapper>
              <RoleTitle>{language === 'ar' ? 'بائع' : 'Vendeur'}</RoleTitle>
              <RoleDescription>
                {language === 'ar'
                  ? 'قدم عروضك واربح المزيد'
                  : 'Proposez vos offres et gagnez plus'}
              </RoleDescription>
              <RoleButton>
                {language === 'ar' ? 'لوحة البائع' : 'Dashboard Vendeur'}
                <ArrowRight size={18} />
              </RoleButton>
            </RoleCard>

            <RoleCard
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/driver')}
            >
              <RoleIconWrapper $color="#1FA676">
                <Truck size={32} />
              </RoleIconWrapper>
              <RoleTitle>{language === 'ar' ? 'سائق' : 'Livreur'}</RoleTitle>
              <RoleDescription>
                {language === 'ar'
                  ? 'وصل الطلبات واكسب المكافآت'
                  : 'Livrez les commandes et gagnez des bonus'}
              </RoleDescription>
              <RoleButton>
                {language === 'ar' ? 'لوحة السائق' : 'Dashboard Livreur'}
                <ArrowRight size={18} />
              </RoleButton>
            </RoleCard>

            <RoleCard
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
            >
              <RoleIconWrapper $color="#5C2A2A">
                <Star size={32} />
              </RoleIconWrapper>
              <RoleTitle>{language === 'ar' ? 'حسابي' : 'Mon Compte'}</RoleTitle>
              <RoleDescription>
                {language === 'ar'
                  ? 'إدارة حسابك ومعاملاتك'
                  : 'Gérez votre compte et vos transactions'}
              </RoleDescription>
              <RoleButton>
                {language === 'ar' ? 'لوحة التحكم' : 'Mon Dashboard'}
                <ArrowRight size={18} />
              </RoleButton>
            </RoleCard>
          </RoleCardsGrid>
        </Container>
      </GetStartedSection>

      {/* Features Section */}
      <FeaturesSection>
        <Container>
          <SectionTitle>
            {language === 'ar' ? 'لماذا زينورا؟' : 'Pourquoi Zynora?'}
          </SectionTitle>
          <SectionSubtitle>
            {language === 'ar'
              ? 'منصة مصممة لتوفير تجربة عادلة وشفافة للجميع'
              : 'Une plateforme conçue pour offrir une expérience équitable et transparente'}
          </SectionSubtitle>

          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureIcon $color={feature.color}>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      {/* Roles Section */}
      <RolesSection>
        <Container>
          <SectionTitle>
            {language === 'ar' ? 'انضم إلى زينورا' : 'Rejoignez Zynora'}
          </SectionTitle>
          <SectionSubtitle>
            {language === 'ar'
              ? 'اختر دورك وابدأ رحلتك معنا'
              : 'Choisissez votre rôle et commencez votre parcours'}
          </SectionSubtitle>

          <RolesGrid>
            {roles.map((role, index) => (
              <RoleShowcaseCard
                key={index}
                $accentColor={role.color}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate(role.link)}
              >
                <RoleIcon $color={role.color}>{role.icon}</RoleIcon>
                <ShowcaseRoleTitle>{role.title}</ShowcaseRoleTitle>
                <ShowcaseRoleDescription>{role.description}</ShowcaseRoleDescription>
                <RoleLink>
                  {language === 'ar' ? 'اكتشف المزيد' : 'En savoir plus'}
                  <ArrowRight size={16} />
                </RoleLink>
              </RoleShowcaseCard>
            ))}
          </RolesGrid>
        </Container>
      </RolesSection>

      {/* Stats Section */}
      <StatsSection>
        <Container>
          <StatsGrid>
            <StatItem
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <StatValue>10K+</StatValue>
              <StatLabel>
                {language === 'ar' ? 'مستخدم نشط' : 'Utilisateurs actifs'}
              </StatLabel>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <StatValue>5K+</StatValue>
              <StatLabel>
                {language === 'ar' ? 'طلب يومي' : 'Demandes par jour'}
              </StatLabel>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <StatValue>48</StatValue>
              <StatLabel>
                {language === 'ar' ? 'ولاية مغطاة' : 'Wilayas couvertes'}
              </StatLabel>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <StatValue>98%</StatValue>
              <StatLabel>
                {language === 'ar' ? 'رضا العملاء' : 'Satisfaction client'}
              </StatLabel>
            </StatItem>
          </StatsGrid>
        </Container>
      </StatsSection>
    </Layout>
  );
};

export default LandingPage;
