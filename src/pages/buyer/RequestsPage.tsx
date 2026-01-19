import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Layout, Container } from '../../components/layout';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Clock, CheckCircle, XCircle, FileText, Search } from 'lucide-react';

const PageWrapper = styled.div`
  min-height: calc(100vh - 200px);
  background: ${({ theme }) => theme.colors.bg.primary};
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  border: 2px solid ${({ theme, $active }) =>
    $active ? theme.colors.primary.darkGreen : theme.colors.neutral.grayLighter};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary.darkGreen : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? 'white' : theme.colors.text.secondary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.darkGreen};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const RequestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const RequestCard = styled(motion.div)<{ $status: 'pending' | 'accepted' | 'completed' }>`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 2px solid ${({ theme, $status }) => {
    switch ($status) {
      case 'pending':
        return theme.colors.neutral.grayLighter;
      case 'accepted':
        return '#FFC300' + '40';
      case 'completed':
        return theme.colors.primary.darkGreen + '40';
      default:
        return theme.colors.neutral.grayLighter;
    }
  }};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }
`;

const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const RequestId = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
`;

const StatusBadge = styled.div<{ $status: 'pending' | 'accepted' | 'completed' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background: ${({ $status }) => {
    switch ($status) {
      case 'pending':
        return '#FFC30015';
      case 'accepted':
        return '#FFD60015';
      case 'completed':
        return '#2D6A4F15';
      default:
        return '#E5E7EB';
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case 'pending':
        return '#FFC300';
      case 'accepted':
        return '#FFD600';
      case 'completed':
        return '#2D6A4F';
      default:
        return '#6B7280';
    }
  }};
  font-size: 0.75rem;
  font-weight: 600;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const RequestContent = styled.div`
  margin-bottom: 1.5rem;
`;

const RequestItem = styled.div`
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};

  &:last-child {
    border-bottom: none;
  }
`;

const RequestItemLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`;

const RequestItemValue = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

export const RequestsPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');

  // Mock requests data
  const mockRequests = [
    {
      id: 'REQ-001',
      title: language === 'ar' ? 'طلب منتجات' : 'Demande de produits',
      status: 'pending' as const,
      date: '2024-01-19',
      amount: '$125.00',
      items: 3,
    },
    {
      id: 'REQ-002',
      title: language === 'ar' ? 'طلب توصيل' : 'Demande de livraison',
      status: 'accepted' as const,
      date: '2024-01-18',
      amount: '$45.00',
      items: 1,
    },
    {
      id: 'REQ-003',
      title: language === 'ar' ? 'طلب مكتمل' : 'Demande complétée',
      status: 'completed' as const,
      date: '2024-01-17',
      amount: '$89.99',
      items: 2,
    },
  ];

  const filteredRequests = mockRequests.filter((req) => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  return (
    <Layout>
      <PageWrapper>
        <Container>
          <PageTitle>
            {language === 'ar' ? 'طلباتي' : 'Mes demandes'}
          </PageTitle>
          <PageDescription>
            {language === 'ar'
              ? 'اعرض جميع طلباتك وحالتها'
              : 'Consultez tous vos demandes et leur statut'}
          </PageDescription>

          <FilterTabs>
            <FilterTab
              $active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              {language === 'ar' ? 'الكل' : 'Tous'}
            </FilterTab>
            <FilterTab
              $active={filter === 'pending'}
              onClick={() => setFilter('pending')}
            >
              <Clock />
              {language === 'ar' ? 'قيد الانتظار' : 'En attente'}
            </FilterTab>
            <FilterTab
              $active={filter === 'accepted'}
              onClick={() => setFilter('accepted')}
            >
              <CheckCircle />
              {language === 'ar' ? 'مقبول' : 'Accepté'}
            </FilterTab>
            <FilterTab
              $active={filter === 'completed'}
              onClick={() => setFilter('completed')}
            >
              <CheckCircle />
              {language === 'ar' ? 'مكتمل' : 'Complété'}
            </FilterTab>
          </FilterTabs>

          {filteredRequests.length > 0 ? (
            <RequestsGrid>
              {filteredRequests.map((request, index) => (
                <RequestCard
                  key={request.id}
                  $status={request.status}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RequestHeader>
                    <RequestId>#{request.id}</RequestId>
                    <StatusBadge $status={request.status}>
                      {request.status === 'pending' && <Clock />}
                      {request.status === 'accepted' && <CheckCircle />}
                      {request.status === 'completed' && <CheckCircle />}
                      {request.status === 'pending' && (language === 'ar' ? 'قيد الانتظار' : 'En attente')}
                      {request.status === 'accepted' && (language === 'ar' ? 'مقبول' : 'Accepté')}
                      {request.status === 'completed' && (language === 'ar' ? 'مكتمل' : 'Complété')}
                    </StatusBadge>
                  </RequestHeader>

                  <RequestContent>
                    <RequestItem>
                      <RequestItemLabel>
                        {language === 'ar' ? 'العنوان' : 'Titre'}
                      </RequestItemLabel>
                      <RequestItemValue>{request.title}</RequestItemValue>
                    </RequestItem>

                    <RequestItem>
                      <RequestItemLabel>
                        {language === 'ar' ? 'التاريخ' : 'Date'}
                      </RequestItemLabel>
                      <RequestItemValue>{request.date}</RequestItemValue>
                    </RequestItem>

                    <RequestItem>
                      <RequestItemLabel>
                        {language === 'ar' ? 'المبلغ' : 'Montant'}
                      </RequestItemLabel>
                      <RequestItemValue>{request.amount}</RequestItemValue>
                    </RequestItem>

                    <RequestItem>
                      <RequestItemLabel>
                        {language === 'ar' ? 'عدد العناصر' : 'Nombre d\'éléments'}
                      </RequestItemLabel>
                      <RequestItemValue>{request.items}</RequestItemValue>
                    </RequestItem>
                  </RequestContent>
                </RequestCard>
              ))}
            </RequestsGrid>
          ) : (
            <EmptyState>
              <FileText />
              <p>
                {language === 'ar'
                  ? 'لا توجد طلبات في هذه الفئة'
                  : 'Aucune demande dans cette catégorie'}
              </p>
            </EmptyState>
          )}
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default RequestsPage;
