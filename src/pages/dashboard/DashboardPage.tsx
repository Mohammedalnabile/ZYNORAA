import styled from 'styled-components';
import { motion } from 'framer-motion';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Container } from '../../components/layout';
import { Card, Button, TrustScore } from '../../components/ui';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  User,
  ShoppingBag,
  Package,
  MapPin,
  Clock,
  Settings,
  Bell,
  CreditCard,
  Star,
  ChevronRight,
  TrendingUp,
  Award,
  Wallet,
  Moon,
  Sun,
} from 'lucide-react';

const DashboardWrapper = styled.div`
  padding: 2rem 0;
  
  @media (max-width: 768px) {
    padding: 1rem 0;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const WelcomeSection = styled.div`
  flex: 1;
`;

const WelcomeText = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  
  span {
    color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
`;

const TimeGreeting = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)<{ $color?: string }>`
  background: ${({ theme, $color }) =>
    $color ? `${$color}15` : theme.colors.bg.secondary};
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const StatIcon = styled.div<{ $color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $color }) => $color || '#2D6A4F'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatInfo = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionCard = styled(Card)`
  padding: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  a {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.primary.darkGreen};
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: 0.75rem;
`;

const ActivityIcon = styled.div<{ $status: 'pending' | 'completed' | 'inProgress' }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $status }) => {
    switch ($status) {
      case 'completed':
        return theme.colors.secondary.mint + '40';
      case 'inProgress':
        return theme.colors.secondary.gold + '40';
      default:
        return theme.colors.neutral.grayLight;
    }
  }};
  color: ${({ theme, $status }) => {
    switch ($status) {
      case 'completed':
        return theme.colors.primary.darkGreen;
      case 'inProgress':
        return theme.colors.secondary.gold;
      default:
        return theme.colors.text.secondary;
    }
  }};
`;

const ActivityInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.125rem;
  }
  
  p {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const ActivityTime = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const QuickAction = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary.darkGreen + '10'};
    transform: translateY(-2px);
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
  
  span {
    font-size: 0.75rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.primary};
    text-align: center;
  }
`;

const TrustSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
`;

const TrustLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NightModeBanner = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 0.75rem;
  color: white;
  
  svg {
    color: #FFC300;
  }
`;

const NightModeInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.125rem;
  }
  
  p {
    font-size: 0.75rem;
    opacity: 0.8;
  }
`;

const DashboardPage: React.FC = () => {
  const { language } = useLanguage();
  const { isNightMode } = useTheme();
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: language === 'ar' ? 'أحمد' : 'Ahmed',
    trustScore: 87,
    wallet: 24500,
    activeOrders: 3,
    completedOrders: 42,
  };

  const stats = [
    {
      icon: <Package size={24} />,
      value: user.activeOrders,
      label: language === 'ar' ? 'طلبات نشطة' : 'Commandes actives',
      color: '#2D6A4F',
    },
    {
      icon: <TrendingUp size={24} />,
      value: user.completedOrders,
      label: language === 'ar' ? 'طلبات مكتملة' : 'Commandes terminées',
      color: '#4D96FF',
    },
    {
      icon: <Wallet size={24} />,
      value: `${user.wallet.toLocaleString()} DA`,
      label: language === 'ar' ? 'رصيد المحفظة' : 'Solde Portefeuille',
      color: '#FFC300',
    },
    {
      icon: <Star size={24} />,
      value: '4.8',
      label: language === 'ar' ? 'متوسط التقييم' : 'Note moyenne',
      color: '#F94144',
    },
  ];

  const activities = [
    {
      id: 1,
      title: language === 'ar' ? 'طلب جديد من Boucherie El Baraka' : 'Nouvelle offre de Boucherie El Baraka',
      time: language === 'ar' ? 'منذ 5 دقائق' : 'Il y a 5 min',
      status: 'pending' as const,
    },
    {
      id: 2,
      title: language === 'ar' ? 'التوصيل في الطريق' : 'Livraison en cours',
      time: language === 'ar' ? 'منذ 20 دقيقة' : 'Il y a 20 min',
      status: 'inProgress' as const,
    },
    {
      id: 3,
      title: language === 'ar' ? 'اكتمل طلب Pizza Palace' : 'Commande Pizza Palace terminée',
      time: language === 'ar' ? 'منذ ساعة' : 'Il y a 1h',
      status: 'completed' as const,
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'ar') {
      if (hour < 12) return 'صباح الخير';
      if (hour < 18) return 'مساء الخير';
      return 'مساء الخير';
    }
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <Layout>
      <DashboardWrapper>
        <Container>
          <DashboardHeader>
            <WelcomeSection>
              <WelcomeText>
                {getGreeting()}, <span>{user.name}</span> 👋
              </WelcomeText>
              <TimeGreeting>
                {isNightMode ? <Moon size={16} /> : <Sun size={16} />}
                {isNightMode
                  ? language === 'ar'
                    ? 'الوضع الليلي نشط - مكافآت إضافية!'
                    : 'Mode nuit actif - Bonus disponibles!'
                  : language === 'ar'
                  ? 'لوحة التحكم الخاصة بك'
                  : 'Votre tableau de bord'}
              </TimeGreeting>
            </WelcomeSection>
            <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
              <Settings size={16} />
              {language === 'ar' ? 'الإعدادات' : 'Paramètres'}
            </Button>
          </DashboardHeader>

          {isNightMode && (
            <NightModeBanner
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: '1.5rem' }}
            >
              <Moon size={28} />
              <NightModeInfo>
                <h4>{language === 'ar' ? '🌙 الوضع الليلي' : '🌙 Mode Nuit Actif'}</h4>
                <p>
                  {language === 'ar'
                    ? 'احصل على خصم 20% على التوصيل + مكافآت إضافية!'
                    : '20% de réduction sur la livraison + bonus supplémentaires!'}
                </p>
              </NightModeInfo>
              <Award size={24} />
            </NightModeBanner>
          )}

          <QuickStats>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                $color={stat.color}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <StatIcon $color={stat.color}>{stat.icon}</StatIcon>
                <StatInfo>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                </StatInfo>
              </StatCard>
            ))}
          </QuickStats>

          <DashboardGrid>
            <MainSection>
              <SectionCard variant="elevated">
                <SectionHeader>
                  <h3>
                    <Clock size={18} />
                    {language === 'ar' ? 'النشاط الأخير' : 'Activité récente'}
                  </h3>
                  <Link to="/buyer/offers">
                    {language === 'ar' ? 'عرض الكل' : 'Voir tout'}
                    <ChevronRight size={14} />
                  </Link>
                </SectionHeader>
                <ActivityList>
                  {activities.map((activity) => (
                    <ActivityItem key={activity.id}>
                      <ActivityIcon $status={activity.status}>
                        {activity.status === 'completed' ? (
                          <Package size={18} />
                        ) : activity.status === 'inProgress' ? (
                          <MapPin size={18} />
                        ) : (
                          <Bell size={18} />
                        )}
                      </ActivityIcon>
                      <ActivityInfo>
                        <h4>{activity.title}</h4>
                        <p>
                          {activity.status === 'completed'
                            ? language === 'ar'
                              ? 'مكتمل'
                              : 'Terminé'
                            : activity.status === 'inProgress'
                            ? language === 'ar'
                              ? 'قيد التوصيل'
                              : 'En cours'
                            : language === 'ar'
                            ? 'في الانتظار'
                            : 'En attente'}
                        </p>
                      </ActivityInfo>
                      <ActivityTime>{activity.time}</ActivityTime>
                    </ActivityItem>
                  ))}
                </ActivityList>
              </SectionCard>

              <SectionCard variant="elevated">
                <SectionHeader>
                  <h3>
                    <ShoppingBag size={18} />
                    {language === 'ar' ? 'إجراءات سريعة' : 'Actions rapides'}
                  </h3>
                </SectionHeader>
                <QuickActions>
                  <QuickAction to="/">
                    <ShoppingBag />
                    <span>{language === 'ar' ? 'طلب جديد' : 'Nouvelle demande'}</span>
                  </QuickAction>
                  <QuickAction to="/buyer/tracking">
                    <MapPin />
                    <span>{language === 'ar' ? 'تتبع الطلب' : 'Suivre commande'}</span>
                  </QuickAction>
                  <QuickAction to="/wallet">
                    <CreditCard />
                    <span>{language === 'ar' ? 'المحفظة' : 'Portefeuille'}</span>
                  </QuickAction>
                  <QuickAction to="/settings">
                    <Settings />
                    <span>{language === 'ar' ? 'الإعدادات' : 'Paramètres'}</span>
                  </QuickAction>
                </QuickActions>
              </SectionCard>
            </MainSection>

            <Sidebar>
              <SectionCard variant="elevated">
                <SectionHeader>
                  <h3>
                    <Award size={18} />
                    {language === 'ar' ? 'نقاط الثقة' : 'Score de Confiance'}
                  </h3>
                </SectionHeader>
                <TrustSection>
                  <TrustScore score={user.trustScore} size="lg" variant="circle" />
                  <TrustLabel>
                    {user.trustScore >= 80
                      ? language === 'ar'
                        ? 'أداء ممتاز! 🎉'
                        : 'Excellent! 🎉'
                      : user.trustScore >= 60
                      ? language === 'ar'
                        ? 'أداء جيد'
                        : 'Bon travail'
                      : language === 'ar'
                      ? 'يمكنك التحسن'
                      : 'Peut mieux faire'}
                  </TrustLabel>
                </TrustSection>
              </SectionCard>

              <SectionCard variant="elevated">
                <SectionHeader>
                  <h3>
                    <User size={18} />
                    {language === 'ar' ? 'حسابي' : 'Mon Profil'}
                  </h3>
                  <Link to="/profile">
                    {language === 'ar' ? 'تعديل' : 'Modifier'}
                    <ChevronRight size={14} />
                  </Link>
                </SectionHeader>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #2D6A4F 0%, #95D5B2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                    }}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                      {language === 'ar' ? 'مشتري' : 'Acheteur'}
                    </div>
                  </div>
                </div>
              </SectionCard>
            </Sidebar>
          </DashboardGrid>
        </Container>
      </DashboardWrapper>
    </Layout>
  );
};

export default DashboardPage;
