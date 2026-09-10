import { Header } from '../../components/Header';
import { HeroSection } from '../../components/HeroSection';
import { AboutPage } from '../About/AboutPage';
import { ContactPage } from '../Contact/ContactPage';
import { MerchLink } from '../MerchLink/MerchLink';
import { NewsPage } from '../News/NewsPage';
import { SocialPage } from '../Socials/SocialPage';
import './HomePage.css';

export function HomePage() {
  return (
    <>
      <title>Xoxxly | Rocket League Twitch Streamer</title>

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