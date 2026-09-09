import { AnimatedOnScroll } from '../../components/AnimationOnScroll';
import './AboutPage.css';

export function AboutPage() {
  return (
    <section id="about" className="about-section" data-header-theme="dark">
      <AnimatedOnScroll className="about-container">
        <div className="about-title">
          <p className="at-text">About</p>
        </div>
        <div className="content-grid">
          <div className="content-card">
            <img className="content-card-img" src="/Images/About/TwitchLogoBlack_Transparent.png" />
            <p className="cc-text">Xoxxly is a twitch streamer from Texas United States. He currently has 49,233 followers on twitch, and has been streaming for 4 years.</p>
          </div>
          <div className="content-card">
            <img className="content-card-img" src="/Images/About/BlackRLLogo_Transparent.png" />
            <p className="cc-text">Xoxxly's main game streamed on twitch is Rocket League. He currently has over 8,000 hours logged in Rocket League, and mainly plays casual games with friends on stream.</p>
          </div>
          <div className="content-card">
            <img className="content-card-img" src="/Images/About/BlackValTransparent.png" />
            <p className="cc-text">Xoxxly sometimes streams Valorant as well, usually after a long session on Rocket League. Streams also sometimes feature mini games while he takes a short breakfast break.</p>
          </div>
          <div className="content-card">
            <img className="content-card-img" src="/Images/About/BlackClock_Transparent.png" />
            <p className="cc-text">Xoxxly typically goes live from around 03:00 CST. His typical stream lasts from around 4 hours long to sometimes as long as 8 hours, and he is live usually every single day of the week.</p>
          </div>
        </div>
      </AnimatedOnScroll>
    </section>
  );
}