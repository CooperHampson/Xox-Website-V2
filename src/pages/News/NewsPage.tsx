import { AnimatedOnScroll } from '../../components/AnimationOnScroll';
import { NewsCardGeneration } from './components/NewsCardGeneration';
import './NewsPage.css';

export function NewsPage() {
  return (
    <>
      <section className="news-section" data-header-theme="light">
        <AnimatedOnScroll className="news-and-updates-container">
          <div className="news-and-updates-grid">
            <div className="news-title-grid">
              <p className="news-title-text">News and Updates</p>

              <NewsCardGeneration />
            </div>
          </div>
        </AnimatedOnScroll>
      </section>
    </>
  );
}