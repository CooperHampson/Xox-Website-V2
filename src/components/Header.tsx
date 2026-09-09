import { HashLink as Link} from 'react-router-hash-link';
import { useHeaderTheme } from './useHeaderTheme';
import './Header.css';

export function Header() {

  const theme = useHeaderTheme();

  return (
    <>
      <div className={`header header-${theme}`}>
        <div className="middle-section">
          <div className="xox-branding">
            <Link smooth to="#/" className="link-general logo-container">
              <img src="Images/Header/LogoWhite.png" className="ms-img logo-white" alt="Xoxxly Logo" />
              <img src="Images/Header/LogoInverted.png" className="ms-img logo-inverted" alt="" />
            </Link>
            <Link smooth to="#/" className="link-general">
              <p className="ms-text">Xoxxly</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}