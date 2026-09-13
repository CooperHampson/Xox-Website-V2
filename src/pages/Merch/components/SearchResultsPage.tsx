import { Link, useSearchParams } from 'react-router-dom';
import { MerchData } from './MerchData';
import { searchMerch } from './SearchUtils';

import { useCurrency } from '../currency/CurrencyContext';
import { convertPrice, formatPrice } from '../currency/CurrencyConverter';

import { MerchHeader } from './MerchHeader';

import './SearchResultsPage.css';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const { currentCurrency } = useCurrency();

  const query = searchParams.get('q') ?? '';

  const results = searchMerch(MerchData, query);

  return (
    <>
      <title>Xoxxly | Search Results</title>

      <MerchHeader />

      <main className="search-results-page">
        <div className="search-results-header">
          <h1>Search Results</h1>

          {query && (
            <p>Results for <strong>"{query}"</strong></p>
          )}
        </div>

        {results.length > 0 ? (
          <div className="search-results-grid">
            {results.map((item) => {
              const convertedPrice = convertPrice(item.price, currentCurrency.code);
              const formattedPrice = formatPrice(convertedPrice, currentCurrency.code);

              return (
                <Link key={item.id} to={`/store/product/${item.id}`} className="search-result-link">
                  <div className="search-result-item">
                    <img className="search-result-image" src={`${import.meta.env.BASE_URL}${item.images[0]}`} alt={item.name} />

                    <h2 className="search-result-name">{item.name}</h2>

                    <p className="search-result-price">{formattedPrice}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="search-no-results">
            <h2>No products found</h2>

            <p>We couldn't find any products matching "{query}".</p>

            <Link to="/store">Back to Store</Link>
          </div>
        )}
      </main>
    </>
  );
}