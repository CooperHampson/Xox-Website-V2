import { Link } from 'react-router-dom';

import type { MerchItem } from '../../../types/merch';

import { useCurrency } from '../currency/CurrencyContext';

import { convertPrice, formatPrice } from '../currency/CurrencyConverter';

import './StoreLayout.css';

interface StoreLayoutProps {
  category?: string;
  featured?: boolean;
  items: MerchItem[];
  layout?: 'default' | 'featured';
}

export function StoreLayout({
  category,
  featured = false,
  items,
  layout = 'default',
}: StoreLayoutProps) {
  const { currentCurrency, exchangeRates } = useCurrency();

  let displayedMerch = items;

  if (category) {
    displayedMerch = displayedMerch.filter(
      (item) => item.category === category,
    );
  }

  if (featured) {
    displayedMerch = displayedMerch.filter(
      (item) => item.featured === true,
    );
  }

  return (<div className="merch-layout-container">
    <div className={`merch-row merch-row-${layout}`}>
      {displayedMerch.map((item) => {
        const convertedPrice = convertPrice(
          item.price,
          currentCurrency.code,
          exchangeRates,
        );

        const formattedPrice = formatPrice(
          convertedPrice,
          currentCurrency.code,
        );

        const image = item.images?.[0];

        const imageSrc = image
          ? /^https?:\/\//i.test(image)
            ? image
            : `${import.meta.env.BASE_URL}${image.replace(/^\/+/, '')}`
          : undefined;

        return (
          <Link
            to={`/store/product/${item.id}`}
            className="merch-item-link"
            key={item.id}
          >
            <div className="merch-item">
              {imageSrc ? (
                <img
                  className="merch-item-img"
                  src={imageSrc}
                  alt={item.name}
                  loading="lazy"
                />
              ) : (
                <div
                  className="merch-item-img merch-item-img-placeholder"
                  role="img"
                  aria-label={`No image available for ${item.name}`}
                />
              )}

              <h2 className="merch-item-name">{item.name}</h2>

              <p className="merch-item-price">
                From {formattedPrice}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  </div>


  );
}
