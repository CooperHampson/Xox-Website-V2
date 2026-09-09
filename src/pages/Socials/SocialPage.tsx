import { AnimatedOnScroll } from '../../components/AnimationOnScroll';
import { socialText } from './SocialText';
import './SocialPage.css';

export function SocialPage() {
  return (
    <section className="social-section" data-header-theme="dark">

      <AnimatedOnScroll className="socials-container">

        <div className="socials-title">
          <p className="st-text">Socials</p>
        </div>

        <div className="socials-grid">

          {[...socialText].reverse().map((socials) => (
            <div key={socials.id} className="socials-card">
              <a href={socials.anchor} target="_blank" className="link-general">
                <img src={socials.img} className="sc-img" />
              </a>
              <p className="sc-text">{socials.description}</p>
            </div>
          ))}
        </div>
      </AnimatedOnScroll>
    </section>
  );
}