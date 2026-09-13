import { Link } from 'react-router-dom';

import { MerchData } from './MerchData';
import type { MerchItem } from './MerchData';
import { useCurrency } from '../currency/CurrencyContext';

import { convertPrice, formatPrice } from '../currency/CurrencyConverter';

import './StoreLayout.css';

interface StoreLayoutProps {
  category?: string;
  featured?: boolean;
  items?: MerchItem[];
  layout?: 'default' | 'featured';
}

export function StoreLayout({ category, featured = false, items, layout = 'default' }: StoreLayoutProps) {
  const { currentCurrency } = useCurrency();

  let displayedMerch = items ?? MerchData;

  if (category) {
    displayedMerch = displayedMerch.filter((item) => item.category === category);
  }

  if (featured) {
    displayedMerch = displayedMerch.filter((item) => item.featured === true)
  }

  return (
    <>
      <div className="merch-layout-container">
        <div className={`merch-row merch-row-${layout}`}>
          {displayedMerch.map((item) => {
            const convertedPrice = convertPrice(item.price, currentCurrency.code);

            const formattedPrice = formatPrice(convertedPrice, currentCurrency.code);

            return (
              <Link to={`/store/product/${item.id}`} className="merch-item-link" key={item.id}>
                <div className="merch-item" key={item.id}>
                  <img className="merch-item-img" src={`${import.meta.env.BASE_URL}${item.images[0]}`} alt={item.name} />

                  <h2 className="merch-item-name">{item.name}</h2>

                  <p className="merch-item-price">{formattedPrice}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}