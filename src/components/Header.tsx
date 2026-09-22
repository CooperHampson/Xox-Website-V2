import { Link } from 'react-router-dom';
import { useHeaderTheme } from './useHeaderTheme';
import './Header.css';

export function Header() {

  const theme = useHeaderTheme();

  return (
    <>
      <div className={`header header-${theme}`}>
        <div className="middle-section">
          <div className="xox-branding">
            <Link to="/" className="link-general logo-container" onClick={() => {
              window.scrollTo({top: 0, behavior: 'smooth',});
            }}>
              <img src={`${import.meta.env.BASE_URL}Images/Header/LogoWhite.png`} className="ms-img logo-white" alt="Xoxxly Logo" />
              <img src={`${import.meta.env.BASE_URL}Images/Header/LogoInverted.png`} className="ms-img logo-inverted" alt="" />
            </Link>
            <Link to="/" className="link-general" onClick={() => {
              window.scrollTo({top: 0, behavior: 'smooth',});
            }}>
              <p className="ms-text">Xoxxly</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}