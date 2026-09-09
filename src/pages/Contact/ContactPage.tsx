import { Link } from 'react-router';
import { ScrollAnimate } from './ContactPageAnim';
import './ContactPage.css';

export function ContactPage() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <ScrollAnimate className="colour-section">
          <h2>
            <ScrollAnimate className="contact-title">Contact Me</ScrollAnimate>
          </h2>
          
          <Link to="mailto:xoxxly.business@gmail.com" className="mail-link">
            <ScrollAnimate className="contact-details">Xoxxly.Business@gmail.com</ScrollAnimate>
          </Link>
          <Link to="https://discord.gg/B3NBq25zwA" target="_blank" className="insta-link">
            <ScrollAnimate className="instagram-me">Discord</ScrollAnimate>
          </Link>
        </ScrollAnimate>
      </div>
    </section>
  );
}