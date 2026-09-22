import './HeroSection.css';

export function HeroSection() {
  return (
    <section className="hero-section" data-header-theme="light">
      <div className="hero-container">
        <img className="hero-img" src={`${import.meta.env.BASE_URL}Images/Hero/xoxxlyheader.png`} />
      </div>
    </section>
  );
}