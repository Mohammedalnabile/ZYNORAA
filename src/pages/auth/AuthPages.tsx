import styled from 'styled-components';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Container } from '../../components/layout';
import { Button, Input } from '../../components/ui';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  ShoppingBag,
  Store,
  Truck,
} from 'lucide-react';

const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const AuthContainer = styled(Container)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const AuthCard = styled(motion.div)`
  width: 100%;
  max-width: 440px;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.darkGreen};
  text-decoration: none;
`;

const LogoIcon = styled.div`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #2D6A4F 0%, #95D5B2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
`;

const AuthTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const AuthSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 0.25rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: right;
  font-size: 0.875rem;
  color: #2D6A4F;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BackLink = styled(Link)`
  display: block;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid #E5E7EB;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.neutral.grayLighter};
  }
  
  span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.text.tertiary};
    text-transform: uppercase;
  }
`;

const RoleSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const RoleOption = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary.darkGreen + '15' : theme.colors.bg.tertiary};
  border: 2px solid ${({ theme, $selected }) =>
    $selected ? theme.colors.primary.darkGreen : 'transparent'};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.darkGreen};
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme, $selected }) =>
      $selected ? theme.colors.primary.darkGreen : theme.colors.text.secondary};
  }
  
  span {
    font-size: 0.75rem;
    font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
    color: ${({ theme, $selected }) =>
      $selected ? theme.colors.primary.darkGreen : theme.colors.text.secondary};
  }
`;

const AuthFooter = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 1.5rem;
  
  a {
    color: ${({ theme }) => theme.colors.primary.darkGreen};
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

type UserRole = 'buyer' | 'seller' | 'driver';

export const LoginPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email || !password) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Veuillez remplir tous les champs');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(language === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Email invalide');
      return;
    }

    if (password.length < 6) {
      setError(language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        setError('');
        // Redirect to dashboard after successful login
        const redirectUrl = sessionStorage.getItem('redirectUrl') || '/dashboard';
        sessionStorage.removeItem('redirectUrl');
        navigate(redirectUrl);
      } else {
        setError(language === 'ar' ? 'فشل تسجيل الدخول' : 'Échec de la connexion');
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول' : 'Une erreur s\'est produite lors de la connexion');
    }
  };

  return (
    <Layout showFooter={false}>
      <AuthWrapper>
        <AuthContainer>
          <AuthCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LogoSection>
              <Logo to="/">
                <LogoIcon>Z</LogoIcon>
                Zynora
              </Logo>
            </LogoSection>

            <AuthTitle>
              {language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
            </AuthTitle>
            <AuthSubtitle>
              {language === 'ar'
                ? 'أدخل بياناتك للوصول إلى حسابك'
                : 'Entrez vos identifiants pour accéder à votre compte'}
            </AuthSubtitle>

            <Form onSubmit={handleSubmit}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '0.75rem 1rem',
                    background: '#FEE2E2',
                    color: '#991B1B',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    border: '1px solid #FECACA',
                  }}
                >
                  {error}
                </motion.div>
              )}

              <Input
                type="email"
                placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                leftIcon={<Mail size={18} />}
              />

              <FormGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  leftIcon={<Lock size={18} />}
                />
              </FormGroup>

              <ForgotPasswordLink to="/forgot-password">
                {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Mot de passe oublié?'}
              </ForgotPasswordLink>

              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                size="lg"
                disabled={isLoading}
              >
                {isLoading 
                  ? (language === 'ar' ? 'جاري التسجيل...' : 'Connexion en cours...')
                  : (language === 'ar' ? 'تسجيل الدخول' : 'Se connecter')
                }
                {!isLoading && <ArrowRight size={18} />}
              </Button>
            </Form>

            <AuthFooter>
              {language === 'ar' ? 'ليس لديك حساب؟' : "Vous n'avez pas de compte?"}{' '}
              <Link to="/signup">
                {language === 'ar' ? 'إنشاء حساب' : "S'inscrire"}
              </Link>
            </AuthFooter>
            
            <BackLink to="/">
              ← {language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : "Retour à l'accueil"}
            </BackLink>
          </AuthCard>
        </AuthContainer>
      </AuthWrapper>
    </Layout>
  );
};

export const SignupPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [role, setRole] = useState<UserRole>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !email || !password) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Veuillez remplir tous les champs');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(language === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Email invalide');
      return;
    }

    if (password.length < 6) {
      setError(language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const success = await signup({
        name,
        email,
        phone,
        password,
        roles: [role],
      });

      if (success) {
        setError('');
        navigate('/dashboard');
      } else {
        setError(language === 'ar' ? 'فشل التسجيل' : 'Échec de l\'inscription');
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ أثناء التسجيل' : 'Une erreur s\'est produite lors de l\'inscription');
    }
  };

  const roles = [
    { key: 'buyer' as UserRole, icon: <ShoppingBag />, label: { fr: 'Acheteur', ar: 'مشتري' } },
    { key: 'seller' as UserRole, icon: <Store />, label: { fr: 'Vendeur', ar: 'بائع' } },
    { key: 'driver' as UserRole, icon: <Truck />, label: { fr: 'Livreur', ar: 'سائق' } },
  ];

  return (
    <Layout showFooter={false}>
      <AuthWrapper>
        <AuthContainer>
          <AuthCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LogoSection>
              <Logo to="/">
                <LogoIcon>Z</LogoIcon>
                Zynora
              </Logo>
            </LogoSection>

            <AuthTitle>
              {language === 'ar' ? 'إنشاء حساب' : 'Créer un compte'}
            </AuthTitle>
            <AuthSubtitle>
              {language === 'ar'
                ? 'انضم إلى زينورا اليوم'
                : 'Rejoignez Zynora aujourd\'hui'}
            </AuthSubtitle>

            <RoleSelector>
              {roles.map((r) => (
                <RoleOption
                  key={r.key}
                  type="button"
                  $selected={role === r.key}
                  onClick={() => setRole(r.key)}
                >
                  {r.icon}
                  <span>{language === 'ar' ? r.label.ar : r.label.fr}</span>
                </RoleOption>
              ))}
            </RoleSelector>

            <Form onSubmit={handleSubmit}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '0.75rem 1rem',
                    background: '#FEE2E2',
                    color: '#991B1B',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    border: '1px solid #FECACA',
                  }}
                >
                  {error}
                </motion.div>
              )}

              <Input
                type="text"
                placeholder={
                  role === 'seller'
                    ? language === 'ar'
                      ? 'اسم المتجر / المطعم'
                      : 'Nom du magasin / restaurant'
                    : language === 'ar'
                    ? 'الاسم الكامل'
                    : 'Nom complet'
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                leftIcon={role === 'seller' ? <Store size={18} /> : <User size={18} />}
              />

              <Input
                type="email"
                placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                leftIcon={<Mail size={18} />}
              />

              <Input
                type="tel"
                placeholder={language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                leftIcon={<Phone size={18} />}
              />

              <FormGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  leftIcon={<Lock size={18} />}
                />
              </FormGroup>

              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                size="lg"
                disabled={isLoading}
              >
                {isLoading 
                  ? (language === 'ar' ? 'جاري الإنشاء...' : 'Création en cours...')
                  : (language === 'ar' ? 'إنشاء حساب' : 'Créer un compte')
                }
                {!isLoading && <ArrowRight size={18} />}
              </Button>
            </Form>

            <AuthFooter>
              {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Vous avez déjà un compte?'}{' '}
              <Link to="/login">
                {language === 'ar' ? 'تسجيل الدخول' : 'Se connecter'}
              </Link>
            </AuthFooter>
            
            <BackLink to="/">
              ← {language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : "Retour à l'accueil"}
            </BackLink>
          </AuthCard>
        </AuthContainer>
      </AuthWrapper>
    </Layout>
  );
};

export default LoginPage;
