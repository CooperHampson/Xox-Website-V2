import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { MerchHeader } from '../components/MerchHeader';
import { useAuth } from '../../../auth/AuthContext';
import { updateCurrentUser } from '../../../api/authApi';

import './AccountPage.css';

export function AccountPage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUsername(user?.username ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
  }, [user]);

  function getNextUpdateDate(updatedAt: string | null,) {
    if (!updatedAt) {
      return null;
    }

    const updatedDate = new Date(updatedAt);
    const nextUpdateDate = new Date(updatedDate.getTime() + 30 * 24 * 60 * 60 * 1000,);

    if (nextUpdateDate <= new Date()) {
      return null;
    }

    return nextUpdateDate;
  }

  function formatCooldown(updatedAt: string | null,) {
    const nextUpdateDate = getNextUpdateDate(updatedAt);

    if (!nextUpdateDate) {
      return 'Can be changed anytime.';
    }

    return `Can be changed again on ${nextUpdateDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    )}.`;
  }

  function isOnCooldown(updatedAt: string | null) {
    return getNextUpdateDate(updatedAt) !== null;
  }

  const usernameOnCooldown = isOnCooldown(user?.usernameUpdatedAt ?? null,);
  const emailOnCooldown = isOnCooldown(user?.emailUpdatedAt ?? null,);
  const passwordOnCooldown = isOnCooldown(user?.passwordUpdatedAt ?? null,);

  function handleLogout() {
    logout();
    navigate('/store');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>,) {
    event.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    const hasUsernameChanged =
      username !== user?.username;

    const hasEmailChanged =
      email !== user?.email;

    const hasPasswordChanged =
      password.length > 0;

    if (
      !hasUsernameChanged &&
      !hasEmailChanged &&
      !hasPasswordChanged
    ) {
      setErrorMessage(
        'No changes were made.',
      );
      setIsLoading(false);
      return;
    }

    try {
      const updatedUser = await updateCurrentUser({
        ...(username !== user?.username
          ? { username }
          : {}),
        ...(email !== user?.email
          ? { email }
          : {}),
        ...(password
          ? { password }
          : {}),
      });

      updateUser(updatedUser);

      setPassword('');
      setSuccessMessage('Account updated successfully',);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setErrorMessage(
            'Unable to connect to the server.',
          );
        } else if (
          error.response.status === 409
        ) {
          setErrorMessage(
            error.response.data?.message ??
            'That username or email is already in use.',
          );
        } else {
          setErrorMessage(
            error.response.data?.message ??
            'Unable to update your account.',
          );
        }
      } else {
        setErrorMessage(
          'Something went wrong. Please try again.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <MerchHeader />

      <div className="account-page-container">
        <h1 className="account-page-title">Account Page</h1>

        <div className="account-info-container">
          <p className="account-info-title">Account</p>

          <form className="account-info-form" onSubmit={handleSubmit}>

            <div className="account-info-field">
              <label className="account-info-text">
                <span>Username:</span>
                <input className="account-info-input" type="text" value={username} onChange={(event) => setUsername(event.target.value)} minLength={3} maxLength={15} disabled={usernameOnCooldown} required />
              </label>

              <p className={usernameOnCooldown ? 'account-info-cooldown account-info-cooldown-locked' : 'account-info-cooldown'}>
                {formatCooldown(user?.usernameUpdatedAt ?? null)}
              </p>

              <p className="account-info-req-title">
                <span>Username Requirements</span>
              </p>
              <p className="account-info-req-text">&bull; Min 3 Characters <br /> &bull; Max 15 Characters</p>
            </div>

            <div className="account-info-field">
              <label className="account-info-text">
                <span>Email:</span>
                <input className="account-info-input" type="text" value={email} onChange={(event) => setEmail(event.target.value)} disabled={emailOnCooldown} required />
              </label>

              <p className={emailOnCooldown ? 'account-info-cooldown account-info-cooldown-locked' : 'account-info-cooldown'}>
                {formatCooldown(user?.emailUpdatedAt ?? null)}
              </p>
            </div>

            <div className="account-info-field">
              <label className="account-info-text">
                <span>Password:</span>
                <input className="account-info-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={18} disabled={passwordOnCooldown} />
              </label>

              <p className={passwordOnCooldown ? 'account-info-cooldown account-info-cooldown-locked' : 'account-info-cooldown'}>
                {formatCooldown(user?.passwordUpdatedAt ?? null)}
              </p>

              <p className="account-info-req-title">
                <span>Password Requirements</span>
              </p>
              <p className="account-info-req-text">&bull; Min 3 Characters <br /> &bull; Max 18 Characters</p>
            </div>


            {errorMessage && (
              <p className="auth-error">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="account-success">
                {successMessage}
              </p>
            )}

            <button type="submit" disabled={isLoading} className="save-changes-button">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          <button className="logout-button" type="button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
}