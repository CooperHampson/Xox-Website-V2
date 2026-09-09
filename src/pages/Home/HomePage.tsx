import { Header } from '../../components/Header';
import { HeroSection } from '../../components/HeroSection';
import { AboutPage } from '../About/AboutPage';
import { ContactPage } from '../Contact/ContactPage';
import { MerchLink } from '../Merch/MerchLink';
import { NewsPage } from '../News/NewsPage';
import { SocialPage } from '../Socials/SocialPage';
import './HomePage.css';

export function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />

      <AboutPage />
      <NewsPage />
      <SocialPage />
      <MerchLink />
      <ContactPage />
    </>
  );
}