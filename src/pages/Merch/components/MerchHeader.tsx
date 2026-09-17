import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { currencies, useCurrency, type Currency } from '../currency/CurrencyContext';

import { AuthModal } from './AuthModal/AuthModal';
import { useAuth } from '../../../auth/AuthContext';

import './MerchHeader.css';

export function MerchHeader() {
  const { currentCurrency, setCurrentCurrency } = useCurrency();
  const { isAuthenticated, user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleCurrencyChange = (currency: Currency) => {
    setCurrentCurrency(currency);

    console.log(`Currency Changed to: ${currency.code}`);
  };

  const handleSearchSubmit = () => {
    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    navigate(`/store/search?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

  const handleCloseSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <>
      <div className="Merch-Header">
        <div className="MH-left-section">
          <Link to="/" className="MH-Main-Site">
            <img src={`${import.meta.env.BASE_URL}Images/MerchHeader/LogoBlack.png`} className="MH-MS-img" />
          </Link>

          <Link to="/" className="MH-Store-Site">
            <p className="MH-SS-text">Home</p>
          </Link>

          <div className="products-button-container">
            <button className="products-dropdown-button">
              <p className="products-dropdown">Products</p>
            </button>


            <div className="products-horizontal-menu">
              <Link to="/store/all-products" className="product-hz-link">
                <p className="phz-text">All Products</p>
              </Link>
              <Link to="/store/shirts" className="product-hz-link">
                <p className="phz-text">Shirts</p>
              </Link>
              <Link to="/store/hoodies" className="product-hz-link">
                <p className="phz-text">Hoodies</p>
              </Link>
              <Link to="/store/pants" className="product-hz-link">
                <p className="phz-text">Pants</p>
              </Link>
              <Link to="/store/footwear" className="product-hz-link">
                <p className="phz-text">Footwear</p>
              </Link>
              <Link to="/store/daily-life" className="product-hz-link">
                <p className="phz-text">Daily Life</p>
              </Link>
              <Link to="/store/gaming-peripherals" className="product-hz-link">
                <p className="phz-text">Gaming Peripherals</p>
              </Link>
            </div>
          </div>

          <div className="search-products-button-container">

            <button className={`sp-button ${isSearchOpen ? 'active' : ''}`} onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <p className="spb-text">&#x2315;</p>
            </button>

            <div className={`search-horizontal-bar ${isSearchOpen ? 'active' : ''}`}>
              <div className="search-input-wrapper">
                <button type="button" className="inner-search-btn" onClick={handleSearchSubmit}>
                  <p className="isb-text">&#x2315;</p>
                </button>

                <input type="text" placeholder="Search products..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()} />

                <button type="button" className="inner-close-btn" onClick={handleCloseSearch}>
                  <p className="icb-text">X</p>
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="MH-middle-section">
          <Link to="/store" className="MH-Middle-link">
            <p className="MH-Middle-text">Xoxxly Store</p>
          </Link>
        </div>

        <div className="MH-right-section">
          <div className="currency-select-container">

            <div className="currency-dropdown">

              <button className="dropdown-trigger">
                {currentCurrency.symbol} {currentCurrency.code}
              </button>

              <ul className="dropdown-menu">
                {currencies.map((currency) => (
                  <ul key={currency.code}>
                    <button type="button" onClick={() => handleCurrencyChange(currency)} className={currentCurrency.code === currency.code ? 'active' : ''}>
                      {currency.code}
                    </button>
                  </ul>
                ))}
              </ul>
            </div>
          </div>

          <Link to="store/orders" className="MH-RS-order-link">
            <p className="MH-RS-OL-text">Orders</p>
          </Link>

          <Link to="store/cart" className="MH-RS-cart-link">
            <img src={`${import.meta.env.BASE_URL}Images/MerchHeader/MH-Cart-T.png`} className="MH-RS-CL-img" />
          </Link>

          <button type="button" className="MH-RS-account-link" onClick={() => {
            if (isAuthenticated) {
              navigate('/store/account');
              return;
            }

            setIsAuthOpen(true);
          }}>
            <img src={isAuthenticated && user?.image ? user.image : `${import.meta.env.BASE_URL}Images/MerchHeader/MH-Account.png`} className="MH-RS-ACC-img" />
          </button>
        </div>
      </div>

      {isAuthOpen && (
        <AuthModal onClose={() => setIsAuthOpen(false)} />
      )}
    </>
  );
}