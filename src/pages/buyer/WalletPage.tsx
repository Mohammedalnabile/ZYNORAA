import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Layout, Container } from '../../components/layout';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Plus, TrendingUp, Send, Wallet as WalletIcon } from 'lucide-react';

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

const BalanceSection = styled(motion.div)`
  background: linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%);
  border-radius: 2rem;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
`;

const BalanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const BalanceCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const BalanceLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
`;

const BalanceAmount = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const BalanceChange = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ $positive }) => ($positive ? '#95D5B2' : '#FF6B6B')};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  border: 2px solid ${({ theme, $variant }) =>
    $variant === 'secondary' ? theme.colors.primary.darkGreen : 'transparent'};
  background: ${({ theme, $variant }) =>
    $variant === 'secondary' ? 'transparent' : theme.colors.primary.darkGreen};
  color: ${({ theme, $variant }) =>
    $variant === 'secondary' ? theme.colors.primary.darkGreen : 'white'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(45, 106, 79, 0.2);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const TransactionsSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TransactionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const TransactionCard = styled(motion.div)<{ $type: 'credit' | 'debit' }>`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1.5rem;
  padding: 1.5rem;
  border-left: 4px solid ${({ $type }) =>
    $type === 'credit' ? '#2D6A4F' : '#FF6B6B'};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }
`;

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const TransactionTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TransactionAmount = styled.div<{ $type: 'credit' | 'debit' }>`
  font-weight: 700;
  font-size: 1.25rem;
  color: ${({ $type }) => ($type === 'credit' ? '#2D6A4F' : '#FF6B6B')};
`;

const TransactionMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
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

export const WalletPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  // Mock wallet data
  const balance = 1250.50;
  const earnings = 3450.75;
  const spent = 2200.25;

  const mockTransactions = [
    {
      id: 'TXN-001',
      title: language === 'ar' ? 'عملية شراء' : 'Achat',
      amount: '-$45.99',
      type: 'debit' as const,
      date: '2024-01-19',
      description: language === 'ar' ? 'متجر الإلكترونيات' : 'Magasin électronique',
    },
    {
      id: 'TXN-002',
      title: language === 'ar' ? 'إيراد' : 'Revenu',
      amount: '+$125.00',
      type: 'credit' as const,
      date: '2024-01-18',
      description: language === 'ar' ? 'بيع منتج' : 'Vente produit',
    },
    {
      id: 'TXN-003',
      title: language === 'ar' ? 'عملية شراء' : 'Achat',
      amount: '-$89.50',
      type: 'debit' as const,
      date: '2024-01-18',
      description: language === 'ar' ? 'طعام' : 'Restaurant',
    },
    {
      id: 'TXN-004',
      title: language === 'ar' ? 'تحويل' : 'Transfert',
      amount: '+$250.00',
      type: 'credit' as const,
      date: '2024-01-17',
      description: language === 'ar' ? 'تحويل من بنك' : 'Virement bancaire',
    },
  ];

  return (
    <Layout>
      <PageWrapper>
        <Container>
          <PageTitle>
            {language === 'ar' ? 'محفظتي' : 'Mon portefeuille'}
          </PageTitle>
          <PageDescription>
            {language === 'ar'
              ? 'إدارة رصيدك ومعاملاتك المالية'
              : 'Gérez votre solde et vos transactions'}
          </PageDescription>

          {/* Balance Overview */}
          <BalanceSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BalanceGrid>
              <BalanceCard>
                <BalanceLabel>
                  {language === 'ar' ? 'الرصيد الحالي' : 'Solde actuel'}
                </BalanceLabel>
                <BalanceAmount>${balance.toFixed(2)}</BalanceAmount>
                <BalanceChange $positive={true}>
                  <TrendingUp />
                  {language === 'ar' ? 'نشط' : 'Actif'}
                </BalanceChange>
              </BalanceCard>

              <BalanceCard>
                <BalanceLabel>
                  {language === 'ar' ? 'إجمالي الإيرادات' : 'Revenus totaux'}
                </BalanceLabel>
                <BalanceAmount>${earnings.toFixed(2)}</BalanceAmount>
                <BalanceChange $positive={true}>
                  <TrendingUp />
                  {language === 'ar' ? '+12% هذا الشهر' : '+12% ce mois'}
                </BalanceChange>
              </BalanceCard>

              <BalanceCard>
                <BalanceLabel>
                  {language === 'ar' ? 'إجمالي الإنفاق' : 'Total dépenses'}
                </BalanceLabel>
                <BalanceAmount>${spent.toFixed(2)}</BalanceAmount>
                <BalanceChange $positive={false}>
                  <TrendingUp />
                  {language === 'ar' ? '+8% هذا الشهر' : '+8% ce mois'}
                </BalanceChange>
              </BalanceCard>
            </BalanceGrid>
          </BalanceSection>

          {/* Action Buttons */}
          <ActionButtons>
            <ActionButton>
              <Plus />
              {language === 'ar' ? 'إضافة أموال' : 'Ajouter des fonds'}
            </ActionButton>
            <ActionButton $variant="secondary">
              <Send />
              {language === 'ar' ? 'تحويل' : 'Envoyer'}
            </ActionButton>
          </ActionButtons>

          {/* Transactions */}
          <TransactionsSection>
            <SectionTitle>
              {language === 'ar' ? 'آخر المعاملات' : 'Dernières transactions'}
            </SectionTitle>

            {mockTransactions.length > 0 ? (
              <TransactionsGrid>
                {mockTransactions.map((transaction, index) => (
                  <TransactionCard
                    key={transaction.id}
                    $type={transaction.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TransactionHeader>
                      <TransactionTitle>{transaction.title}</TransactionTitle>
                      <TransactionAmount $type={transaction.type}>
                        {transaction.amount}
                      </TransactionAmount>
                    </TransactionHeader>
                    <TransactionMeta>
                      <span>{transaction.description}</span>
                      <span>{transaction.date}</span>
                    </TransactionMeta>
                  </TransactionCard>
                ))}
              </TransactionsGrid>
            ) : (
              <EmptyState>
                <WalletIcon />
                <p>
                  {language === 'ar'
                    ? 'لا توجد معاملات حتى الآن'
                    : 'Aucune transaction pour l\'instant'}
                </p>
              </EmptyState>
            )}
          </TransactionsSection>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default WalletPage;
