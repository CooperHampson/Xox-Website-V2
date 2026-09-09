import { AnimatedOnScroll } from '../../components/AnimationOnScroll';
import './MerchLink.css';

export function MerchLink() {
  return (
    <section className="merchlink-section" data-header-theme="light">
      <AnimatedOnScroll className="merchlink-container">
        <div className="merchlink-title">
          <p className="mlt-text">Merch</p>
        </div>

        <div className="merchlink-grid">
          <p className="mlg-text">Click on the button below to visit Xoxxly's Merch <br />Store. Get the finest Xox merch including clothing, <br />gaming peripherals, water bottles, bags and more!</p>

          <a href="" target="_blank" className="merch-link-general">
            <p className="mlsl-text">Store</p>
          </a>

        </div>


      </AnimatedOnScroll>
    </section>
  );
}