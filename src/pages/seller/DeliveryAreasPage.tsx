import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Layout, Container } from '../../components/layout';
import { Button, Input, Badge, Toggle } from '../../components/ui';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Plus, Trash2, Save, DollarSign, Clock } from 'lucide-react';

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

const AreaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const AreaCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 2px solid ${({ theme }) => theme.colors.neutral.grayLighter};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.darkGreen};
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const AreaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const AreaTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accent.alertRed};
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
`;

const AreaMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
`;

const AreaStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ToggleLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FormSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid ${({ theme }) => theme.colors.neutral.grayLighter};
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

interface DeliveryArea {
  id: string;
  name: string;
  fee: number;
  deliveryTime: string;
  active: boolean;
}

export const DeliveryAreasPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [areas, setAreas] = useState<DeliveryArea[]>([
    {
      id: '1',
      name: language === 'ar' ? 'مركز الجزائر' : 'Centre Alger',
      fee: 300,
      deliveryTime: '30-45',
      active: true,
    },
    {
      id: '2',
      name: language === 'ar' ? 'حي الزيبان' : 'Quartier El Ziban',
      fee: 400,
      deliveryTime: '45-60',
      active: true,
    },
  ]);

  const [newArea, setNewArea] = useState({
    name: '',
    fee: '',
    deliveryTime: '',
  });

  const handleAddArea = () => {
    if (newArea.name && newArea.fee && newArea.deliveryTime) {
      setAreas([
        ...areas,
        {
          id: (areas.length + 1).toString(),
          name: newArea.name,
          fee: parseFloat(newArea.fee),
          deliveryTime: newArea.deliveryTime,
          active: true,
        },
      ]);
      setNewArea({ name: '', fee: '', deliveryTime: '' });
    }
  };

  const handleDeleteArea = (id: string) => {
    setAreas(areas.filter(area => area.id !== id));
  };

  const handleToggleArea = (id: string) => {
    setAreas(
      areas.map(area =>
        area.id === id ? { ...area, active: !area.active } : area
      )
    );
  };

  const handleSave = () => {
    console.log('Saving delivery areas:', areas);
    // TODO: Save to backend
  };

  return (
    <Layout showFooter={false}>
      <PageWrapper>
        <Container>
          <PageHeader>
            <PageTitle>
              {language === 'ar' ? 'مناطق التوصيل' : 'Zones de livraison'}
            </PageTitle>
            <PageDescription>
              {language === 'ar'
                ? 'إدارة مناطق التوصيل والرسوم'
                : 'Gérez vos zones de livraison et les frais'}
            </PageDescription>
          </PageHeader>

          {/* Current Areas */}
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <MapPin size={24} />
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                {language === 'ar' ? 'مناطق الخدمة الحالية' : 'Zones de service actuelles'}
              </h2>
            </div>

            {areas.length > 0 ? (
              <AreaGrid>
                {areas.map((area, index) => (
                  <AreaCard
                    key={area.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AreaHeader>
                      <AreaTitle>{area.name}</AreaTitle>
                      <DeleteButton onClick={() => handleDeleteArea(area.id)}>
                        ×
                      </DeleteButton>
                    </AreaHeader>

                    <AreaMeta>
                      <MetaItem>
                        <DollarSign />
                        {language === 'ar' ? 'رسم التوصيل: ' : 'Frais: '}
                        <strong>{area.fee} DA</strong>
                      </MetaItem>
                      <MetaItem>
                        <Clock />
                        {language === 'ar' ? 'وقت التوصيل: ' : 'Temps: '}
                        <strong>{area.deliveryTime} {language === 'ar' ? 'دقيقة' : 'min'}</strong>
                      </MetaItem>
                    </AreaMeta>

                    <AreaStatus>
                      <ToggleLabel>
                        {language === 'ar' ? 'نشط' : 'Actif'}
                      </ToggleLabel>
                      <Toggle
                        checked={area.active}
                        onChange={() => handleToggleArea(area.id)}
                      />
                    </AreaStatus>
                  </AreaCard>
                ))}
              </AreaGrid>
            ) : (
              <EmptyState>
                <MapPin />
                <p>
                  {language === 'ar'
                    ? 'لا توجد مناطق توصيل'
                    : 'Aucune zone de livraison'}
                </p>
              </EmptyState>
            )}

            {/* Add New Area */}
            <FormSection>
              <FormTitle>
                {language === 'ar' ? 'إضافة منطقة توصيل جديدة' : 'Ajouter une nouvelle zone'}
              </FormTitle>

              <FormGrid>
                <FormGroup>
                  <Label>
                    {language === 'ar' ? 'اسم المنطقة' : 'Nom de la zone'}
                  </Label>
                  <Input
                    placeholder={language === 'ar' ? 'مثال: مركز الجزائر' : 'Ex: Centre Alger'}
                    value={newArea.name}
                    onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    {language === 'ar' ? 'رسم التوصيل (DA)' : 'Frais de livraison (DA)'}
                  </Label>
                  <Input
                    type="number"
                    placeholder="300"
                    value={newArea.fee}
                    onChange={(e) => setNewArea({ ...newArea, fee: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    {language === 'ar' ? 'وقت التوصيل (دقيقة)' : 'Temps de livraison (min)'}
                  </Label>
                  <Input
                    placeholder="30-45"
                    value={newArea.deliveryTime}
                    onChange={(e) => setNewArea({ ...newArea, deliveryTime: e.target.value })}
                  />
                </FormGroup>
              </FormGrid>

              <ButtonGroup>
                <Button
                  variant="primary"
                  leftIcon={<Plus size={18} />}
                  onClick={handleAddArea}
                >
                  {language === 'ar' ? 'إضافة المنطقة' : 'Ajouter la zone'}
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<Save size={18} />}
                  onClick={handleSave}
                >
                  {language === 'ar' ? 'حفظ التغييرات' : 'Enregistrer'}
                </Button>
              </ButtonGroup>
            </FormSection>
          </Card>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default DeliveryAreasPage;
