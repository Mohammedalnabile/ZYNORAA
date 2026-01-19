import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Layout, Container } from '../../components/layout';
import { Button, Badge, Toggle } from '../../components/ui';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Clock, Save, AlertCircle } from 'lucide-react';

const PageWrapper = styled.div`
  min-height: calc(100vh - 200px);
  background: ${({ theme }) => theme.colors.bg.primary};
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  margin-bottom: 1.5rem;
`;

const DayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};

  &:last-child {
    border-bottom: none;
  }
`;

const DayLabel = styled.div`
  min-width: 120px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TimeInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const TimeInput = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
  width: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.darkGreen};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.darkGreen}20;
  }
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ToggleLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SpecialHoursSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid ${({ theme }) => theme.colors.neutral.grayLighter};
`;

const SpecialHoursList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SpecialHourItem = styled.div`
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 1rem;
  padding: 1.5rem;
  border-left: 4px solid ${({ theme }) => theme.colors.primary.darkGreen};
`;

const SpecialHourHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SpecialHourTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accent.alertRed};
  cursor: pointer;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent.alertRed}20;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

export const BusinessHoursPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [hours, setHours] = useState<BusinessHours>({
    Monday: { open: '09:00', close: '22:00', closed: false },
    Tuesday: { open: '09:00', close: '22:00', closed: false },
    Wednesday: { open: '09:00', close: '22:00', closed: false },
    Thursday: { open: '09:00', close: '22:00', closed: false },
    Friday: { open: '10:00', close: '23:00', closed: false },
    Saturday: { open: '10:00', close: '23:00', closed: false },
    Sunday: { open: '11:00', close: '21:00', closed: true },
  });

  const [specialHours, setSpecialHours] = useState<
    { date: string; open: string; close: string; reason: string }[]
  >([]);

  const dayLabels: Record<string, { fr: string; ar: string }> = {
    Monday: { fr: 'Lundi', ar: 'الإثنين' },
    Tuesday: { fr: 'Mardi', ar: 'الثلاثاء' },
    Wednesday: { fr: 'Mercredi', ar: 'الأربعاء' },
    Thursday: { fr: 'Jeudi', ar: 'الخميس' },
    Friday: { fr: 'Vendredi', ar: 'الجمعة' },
    Saturday: { fr: 'Samedi', ar: 'السبت' },
    Sunday: { fr: 'Dimanche', ar: 'الأحد' },
  };

  const handleTimeChange = (day: string, field: 'open' | 'close', value: string) => {
    setHours({
      ...hours,
      [day]: { ...hours[day], [field]: value },
    });
  };

  const handleToggleClosed = (day: string) => {
    setHours({
      ...hours,
      [day]: { ...hours[day], closed: !hours[day].closed },
    });
  };

  const handleSave = () => {
    console.log('Saving business hours:', hours);
    console.log('Saving special hours:', specialHours);
    // TODO: Save to backend
  };

  return (
    <Layout showFooter={false}>
      <PageWrapper>
        <Container>
          <PageHeader>
            <PageTitle>
              {language === 'ar' ? 'ساعات العمل' : 'Horaires d\'ouverture'}
            </PageTitle>
            <PageDescription>
              {language === 'ar'
                ? 'قم بتعيين ساعات عملك والإجازات الخاصة'
                : 'Configurez vos horaires d\'ouverture et jours fériés'}
            </PageDescription>
          </PageHeader>

          {/* Regular Hours */}
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Clock size={24} />
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                {language === 'ar' ? 'ساعات العمل العادية' : 'Horaires réguliers'}
              </h2>
            </div>

            {days.map((day) => (
              <DayRow key={day}>
                <DayLabel>
                  {language === 'ar' ? dayLabels[day].ar : dayLabels[day].fr}
                </DayLabel>
                <TimeInputs>
                  {!hours[day].closed ? (
                    <>
                      <TimeInput
                        type="time"
                        value={hours[day].open}
                        onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                      />
                      <Separator>-</Separator>
                      <TimeInput
                        type="time"
                        value={hours[day].close}
                        onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                      />
                    </>
                  ) : (
                    <Badge variant="error" size="lg">
                      {language === 'ar' ? 'مغلق' : 'Fermé'}
                    </Badge>
                  )}
                </TimeInputs>
                <ToggleWrapper>
                  <ToggleLabel>
                    {language === 'ar' ? 'مغلق' : 'Fermé'}
                  </ToggleLabel>
                  <Toggle
                    checked={hours[day].closed}
                    onChange={() => handleToggleClosed(day)}
                  />
                </ToggleWrapper>
              </DayRow>
            ))}

            {/* Special Hours */}
            <SpecialHoursSection>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 600 }}>
                {language === 'ar' ? 'أوقات خاصة' : 'Horaires spéciaux'}
              </h3>
              {specialHours.length > 0 ? (
                <SpecialHoursList>
                  {specialHours.map((hour, index) => (
                    <SpecialHourItem key={index}>
                      <SpecialHourHeader>
                        <SpecialHourTitle>{hour.date}</SpecialHourTitle>
                        <RemoveButton onClick={() => setSpecialHours(specialHours.filter((_, i) => i !== index))}>
                          {language === 'ar' ? 'حذف' : 'Supprimer'}
                        </RemoveButton>
                      </SpecialHourHeader>
                      <p style={{ margin: '0.5rem 0', fontSize: '0.875rem', color: '#666' }}>
                        {hour.reason}
                      </p>
                      <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
                        {hour.open} - {hour.close}
                      </p>
                    </SpecialHourItem>
                  ))}
                </SpecialHoursList>
              ) : (
                <div style={{ padding: '1rem', color: '#999', fontSize: '0.875rem', textAlign: 'center' }}>
                  {language === 'ar' ? 'لا توجد أوقات خاصة' : 'Aucune heure spéciale'}
                </div>
              )}
            </SpecialHoursSection>

            <ButtonGroup>
              <Button variant="primary" leftIcon={<Save size={18} />} onClick={handleSave} fullWidth>
                {language === 'ar' ? 'حفظ التغييرات' : 'Enregistrer les modifications'}
              </Button>
            </ButtonGroup>
          </Card>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default BusinessHoursPage;
