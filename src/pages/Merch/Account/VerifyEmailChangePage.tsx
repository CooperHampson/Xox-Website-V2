import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Link, useSearchParams } from 'react-router-dom';

import axios from 'axios';

import { verifyEmailChange } from '../../../api/authApi';

import { useAuth } from '../../../auth/AuthContext';
import { MerchHeader } from '../components/MerchHeader';
import './VerifyEmailChangePage.css';

export function VerifyEmailChangePage() {
  const [searchParams] = useSearchParams();
  const { updateUser } = useAuth();

  const [status, setStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');

  const [message, setMessage] = useState('');

  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (verificationAttempted.current) {
      return;
    }

    verificationAttempted.current = true;

    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage(
        'This email verification link is invalid.',
      );
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyEmailChange(token);

        updateUser(result.user);
        setStatus('success');
        setMessage(result.message);
      } catch (error) {
        setStatus('error');

        if (axios.isAxiosError(error)) {
          setMessage(
            error.response?.data?.message ??
            'This email verification link is invalid or has expired.',
          );
        } else {
          setMessage(
            'This email verification link is invalid or has expired.',
          );
        }
      }
    };

    void verify();
  }, [searchParams, updateUser]);

  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`
  };

  return (
    <main>

      <div className="background-container" style={bgImageUrl}>

        <MerchHeader />

        <div className="verify-container">
          {status === 'loading' && (
            <p>Verifying your email address...</p>
          )}

          {status === 'success' && (
            <>
              <p className="verify-title">Email address updated</p>
              <p className="verify-text">{message}</p>

              <Link to="/store/account" className="verify-link">
                Return to your account
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <p className="verify-title">Verification failed</p>
              <p className="verify-text">{message}</p>

              <Link to="/store/account" className="verify-link">
                Return to your account
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
