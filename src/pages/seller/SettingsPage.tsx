import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Layout, Container } from '../../components/layout';
import { Button, Input, Textarea, ImageUpload, Toggle } from '../../components/ui';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Settings, Save, Lock, Bell, Eye } from 'lucide-react';

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

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.grayLighter};

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div``;

const SettingLabel = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const SettingDescription = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const DangerZone = styled(Card)`
  border: 2px solid ${({ theme }) => theme.colors.accent.alertRed}40;
  background: ${({ theme }) => theme.colors.accent.alertRed}05;
`;

const DangerButton = styled(Button)`
  background: ${({ theme }) => theme.colors.accent.alertRed};
  color: white;

  &:hover {
    background: ${({ theme }) => theme.colors.accent.alertRed}dd;
  }
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 1rem;
  background: linear-gradient(135deg, #2D6A4F 0%, #95D5B2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const SettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    storeName: 'Restaurant Le Jardin',
    description: 'Un restaurant traditionnel proposant les meilleurs plats algériens',
    phone: '+213 21 234 5678',
    email: 'contact@lejardin.com',
    address: 'Centre-ville, Alger',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newRequests: true,
    offerAccepted: true,
    paymentReceived: true,
    reviews: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [images, setImages] = useState<any[]>([]);

  const handleSave = () => {
    console.log('Saving settings:', formData);
    console.log('Notification settings:', notificationSettings);
  };

  return (
    <Layout showFooter={false}>
      <PageWrapper>
        <Container>
          <PageHeader>
            <PageTitle>
              {language === 'ar' ? 'الإعدادات' : 'Paramètres'}
            </PageTitle>
            <PageDescription>
              {language === 'ar'
                ? 'إدارة معلومات متجرك والإشعارات'
                : 'Gérez les informations de votre magasin et les notifications'}
            </PageDescription>
          </PageHeader>

          {/* Store Profile */}
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CardHeader>
              <Settings size={24} />
              <CardTitle>
                {language === 'ar' ? 'معلومات المتجر' : 'Informations du magasin'}
              </CardTitle>
            </CardHeader>

            <ProfileImage>R</ProfileImage>

            <FormGroup>
              <Label>
                {language === 'ar' ? 'شعار المتجر' : 'Logo du magasin'}
              </Label>
              <ImageUpload
                multiple={false}
                maxFiles={1}
                onImagesChange={setImages}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                {language === 'ar' ? 'اسم المتجر' : 'Nom du magasin'}
              </Label>
              <Input
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                {language === 'ar' ? 'الوصف' : 'Description'}
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                {language === 'ar' ? 'العنوان' : 'Adresse'}
              </Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </FormGroup>

            <ButtonGroup>
              <Button variant="primary" leftIcon={<Save size={18} />} onClick={handleSave}>
                {language === 'ar' ? 'حفظ التغييرات' : 'Enregistrer les modifications'}
              </Button>
            </ButtonGroup>
          </Card>

          {/* Notification Settings */}
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardHeader>
              <Bell size={24} />
              <CardTitle>
                {language === 'ar' ? 'إعدادات الإشعارات' : 'Paramètres de notification'}
              </CardTitle>
            </CardHeader>

            <SettingRow>
              <SettingInfo>
                <SettingLabel>
                  {language === 'ar' ? 'طلبات جديدة' : 'Nouvelles demandes'}
                </SettingLabel>
                <SettingDescription>
                  {language === 'ar'
                    ? 'إشعار عند استقبال طلب جديد'
                    : 'Notifiez-moi des nouvelles demandes'}
                </SettingDescription>
              </SettingInfo>
              <Toggle
                checked={notificationSettings.newRequests}
                onChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, newRequests: checked })
                }
              />
            </SettingRow>

            <SettingRow>
              <SettingInfo>
                <SettingLabel>
                  {language === 'ar' ? 'العروض المقبولة' : 'Offres acceptées'}
                </SettingLabel>
                <SettingDescription>
                  {language === 'ar'
                    ? 'إشعار عندما يتم قبول عرضك'
                    : 'Notifiez-moi quand mon offre est acceptée'}
                </SettingDescription>
              </SettingInfo>
              <Toggle
                checked={notificationSettings.offerAccepted}
                onChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, offerAccepted: checked })
                }
              />
            </SettingRow>

            <SettingRow>
              <SettingInfo>
                <SettingLabel>
                  {language === 'ar' ? 'الدفع المستقبل' : 'Paiement reçu'}
                </SettingLabel>
                <SettingDescription>
                  {language === 'ar'
                    ? 'إشعار عند استقبال الدفع'
                    : 'Notifiez-moi lors de la réception du paiement'}
                </SettingDescription>
              </SettingInfo>
              <Toggle
                checked={notificationSettings.paymentReceived}
                onChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, paymentReceived: checked })
                }
              />
            </SettingRow>

            <SettingRow>
              <SettingInfo>
                <SettingLabel>
                  {language === 'ar' ? 'التقييمات والآراء' : 'Avis et évaluations'}
                </SettingLabel>
                <SettingDescription>
                  {language === 'ar'
                    ? 'إشعار عند تقييم متجرك'
                    : 'Notifiez-moi des nouveaux avis'}
                </SettingDescription>
              </SettingInfo>
              <Toggle
                checked={notificationSettings.reviews}
                onChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, reviews: checked })
                }
              />
            </SettingRow>

            <SettingRow style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem', marginTop: '1rem' }}>
              <SettingInfo>
                <SettingLabel>
                  {language === 'ar' ? 'إشعارات البريد الإلكتروني' : 'Notifications par email'}
                </SettingLabel>
                <SettingDescription>
                  {language === 'ar'
                    ? 'استقبال الإشعارات عبر البريد الإلكتروني'
                    : 'Recevoir les notifications par email'}
                </SettingDescription>
              </SettingInfo>
              <Toggle
                checked={notificationSettings.emailNotifications}
                onChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                }
              />
            </SettingRow>

            <SettingRow>
              <SettingInfo>
                <SettingLabel>
                  {language === 'ar' ? 'إشعارات الرسائل' : 'Notifications SMS'}
                </SettingLabel>
                <SettingDescription>
                  {language === 'ar'
                    ? 'استقبال الإشعارات عبر الرسائل'
                    : 'Recevoir les notifications par SMS'}
                </SettingDescription>
              </SettingInfo>
              <Toggle
                checked={notificationSettings.smsNotifications}
                onChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                }
              />
            </SettingRow>

            <ButtonGroup>
              <Button variant="primary" leftIcon={<Save size={18} />} onClick={handleSave}>
                {language === 'ar' ? 'حفظ' : 'Enregistrer'}
              </Button>
            </ButtonGroup>
          </Card>

          {/* Security */}
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardHeader>
              <Lock size={24} />
              <CardTitle>
                {language === 'ar' ? 'الأمان' : 'Sécurité'}
              </CardTitle>
            </CardHeader>

            <FormGroup>
              <Label>
                {language === 'ar' ? 'كلمة المرور الحالية' : 'Mot de passe actuel'}
              </Label>
              <Input type="password" placeholder="••••••••" />
            </FormGroup>

            <FormGroup>
              <Label>
                {language === 'ar' ? 'كلمة المرور الجديدة' : 'Nouveau mot de passe'}
              </Label>
              <Input type="password" placeholder="••••••••" />
            </FormGroup>

            <FormGroup>
              <Label>
                {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe'}
              </Label>
              <Input type="password" placeholder="••••••••" />
            </FormGroup>

            <ButtonGroup>
              <Button variant="primary" onClick={handleSave}>
                {language === 'ar' ? 'تحديث كلمة المرور' : 'Mettre à jour le mot de passe'}
              </Button>
            </ButtonGroup>
          </Card>

          {/* Danger Zone */}
          <DangerZone
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardHeader>
              <CardTitle style={{ color: '#FF6B6B' }}>
                {language === 'ar' ? 'منطقة الخطر' : 'Zone dangereuse'}
              </CardTitle>
            </CardHeader>

            <p style={{ color: '#666', marginBottom: '1rem' }}>
              {language === 'ar'
                ? 'حذف حسابك وجميع البيانات المرتبطة به'
                : 'Supprimer votre compte et toutes les données associées'}
            </p>

            <DangerButton>
              {language === 'ar' ? 'حذف الحساب' : 'Supprimer le compte'}
            </DangerButton>
          </DangerZone>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default SettingsPage;
