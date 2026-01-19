import styled from 'styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const FooterWrapper = styled.footer`
  background: ${({ theme }) =>
    theme.mode === 'dark' ? theme.colors.bg.secondary : theme.colors.neutral.charcoal};
  color: ${({ theme }) =>
    theme.mode === 'dark' ? theme.colors.text.primary : 'white'};
  padding: 3rem 1.5rem 1.5rem;
  margin-top: auto;
`;

const FooterContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.gold.light};
`;

const FooterLink = styled(Link)`
  color: inherit;
  opacity: 0.8;
  font-size: 0.875rem;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.colors.gold.light};
  }
`;

const FooterText = styled.p`
  font-size: 0.875rem;
  opacity: 0.8;
  line-height: 1.6;
  margin: 0;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  opacity: 0.8;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gold.primary};
    transform: translateY(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Copyright = styled.p`
  font-size: 0.75rem;
  opacity: 0.6;
  margin: 0;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.gold.bronze} 0%, ${({ theme }) => theme.colors.gold.primary} 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.mode === 'dark' ? theme.colors.gold.light : '#FFFFFF'};
  font-weight: bold;
  font-size: 1.5rem;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.mode === 'dark' ? theme.colors.gold.light : theme.colors.gold.bronze};
`;

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterGrid>
          <FooterSection>
            <LogoSection>
              <LogoIcon>Z</LogoIcon>
              <LogoText>Zynora</LogoText>
            </LogoSection>
            <FooterText>
              {language === 'ar'
                ? 'نظام الفرص الذكي في الجزائر. نربط بين المشترين والبائعين والسائقين في منصة عادلة وشفافة.'
                : "Le système d'opportunités intelligent de l'Algérie. Nous connectons acheteurs, vendeurs et livreurs dans une plateforme équitable et transparente."}
            </FooterText>
            <SocialLinks>
              <SocialLink href="#" aria-label="Facebook">
                <Facebook />
              </SocialLink>
              <SocialLink href="#" aria-label="Twitter">
                <Twitter />
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                <Instagram />
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>
              {language === 'ar' ? 'روابط سريعة' : 'Liens Rapides'}
            </FooterTitle>
            <FooterLink to="/about">
              {language === 'ar' ? 'من نحن' : 'À propos'}
            </FooterLink>
            <FooterLink to="/how-it-works">
              {language === 'ar' ? 'كيف يعمل' : 'Comment ça marche'}
            </FooterLink>
            <FooterLink to="/become-seller">
              {language === 'ar' ? 'كن بائعًا' : 'Devenir vendeur'}
            </FooterLink>
            <FooterLink to="/become-driver">
              {language === 'ar' ? 'كن سائقًا' : 'Devenir livreur'}
            </FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>
              {language === 'ar' ? 'الدعم' : 'Support'}
            </FooterTitle>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/contact">
              {language === 'ar' ? 'اتصل بنا' : 'Contactez-nous'}
            </FooterLink>
            <FooterLink to="/terms">
              {language === 'ar' ? 'الشروط والأحكام' : 'Conditions générales'}
            </FooterLink>
            <FooterLink to="/privacy">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Politique de confidentialité'}
            </FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>
              {language === 'ar' ? 'اتصل بنا' : 'Contact'}
            </FooterTitle>
            <ContactItem>
              <MapPin />
              <span>Algiers, Algeria</span>
            </ContactItem>
            <ContactItem>
              <Phone />
              <span>+213 XX XXX XXXX</span>
            </ContactItem>
            <ContactItem>
              <Mail />
              <span>contact@zynora.dz</span>
            </ContactItem>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <Copyright>
            © {currentYear} Zynora. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}
          </Copyright>
          <Copyright>
            {language === 'ar' ? 'صنع في الجزائر 🇩🇿' : 'Made in Algeria 🇩🇿'}
          </Copyright>
        </FooterBottom>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer;
