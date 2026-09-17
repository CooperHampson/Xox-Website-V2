import { MerchHeader } from '../components/MerchHeader';
import { useAuth } from '../../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css';

export function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/store');
  }

  return (
    <>
      <MerchHeader />

      <div className="account-page-container">
        <h1 className="account-page-title">Account Page</h1>

        <div className="account-info-container">
          <p className="account-info-title">Account</p>

          <p className="account-info-text">Username: {user?.username}</p>

          <p className="account-info-text">Email: {user?.email}</p>

          <button className="logout-button" type="button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
}