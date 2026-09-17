import { useState } from 'react';
import axios from 'axios';

import { startRegistration, verifyRegistration } from '../../../../api/authApi';
import { useAuth } from '../../../../auth/AuthContext';

type RegisterFormProps = {
  onLoginClick: () => void;
  onRegisterSuccess: () => void;
};

export default function RegisterForm({
  onLoginClick,
  onRegisterSuccess,
}: RegisterFormProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [pendingRegistrationId, setPendingRegistrationId] = useState<number | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage('');
    setIsLoading(true);
    try {
      const result = await startRegistration({
        username,
        email,
        password,
      });

      setPendingRegistrationId(
        result.pendingRegistrationId,
      );

      setIsLoading(false);

    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setErrorMessage(
            'Unable to connect to the server.',
          );
        } else if (error.response.status === 409) {
          setErrorMessage(
            'An account with this username or email already exists.',
          );
        } else {
          setErrorMessage(
            'Something went wrong. Please try again.',
          );
        }
      } else {
        setErrorMessage(
          'Something went wrong. Please try again.',
        );
      }

      setUsername('');
      setEmail('');
      setPassword('');

      setIsLoading(false);
    }
  }

  async function handleVerification(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (pendingRegistrationId === null) {
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const result =
        await verifyRegistration({
          pendingRegistrationId,
          verificationCode,
        });

      login(
        result.user,
        result.accessToken,
      );

      onRegisterSuccess();
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setErrorMessage(
            'Unable to connect to the server.',
          );
        } else if (
          error.response.status === 400
        ) {
          setErrorMessage(
            error.response.data?.message ??
            'Invalid verification code.',
          );
        } else {
          setErrorMessage(
            'Something went wrong. Please try again.',
          );
        }
      } else {
        setErrorMessage(
          'Something went wrong. Please try again.',
        );
      }

      setVerificationCode('');
      setIsLoading(false);
    }
  }

  return (
    <div>
      {pendingRegistrationId === null ? (
        <>
          <h3>Create Account</h3>

          {errorMessage && (
            <p className="auth-error">
              {errorMessage}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="register-input-group">
              <label htmlFor="register-username">
                Username
              </label>

              <input
                id="register-username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
              />

              <div className="register-input-rules">
                <p>Username requirements</p>
                <ul>
                  <li>3-15 characters</li>
                  <li>Must be unique</li>
                </ul>
              </div>
            </div>

            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

            <div className="register-input-group">
              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />

              <div className="register-input-rules">
                <p>Password requirements</p>
                <ul>
                  <li>8-18 Characters</li>
                </ul>
              </div>
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p>Already have an account?</p>

          <button
            type="button"
            onClick={onLoginClick}
          >
            Login
          </button>
        </>
      ) : (
        <>
          <h3>Verify Your Email</h3>

          {errorMessage && (
            <p className="auth-error">
              {errorMessage}
            </p>
          )}

          <p className="rfv-t">
            We sent a verification code to:
          </p>

          <p className="rfv-t">{email}</p>

          <form onSubmit={handleVerification}>
            <label htmlFor="verification-code">
              Verification Code
            </label>

            <input
              id="verification-code"
              type="text"
              placeholder="6-character code"
              value={verificationCode}
              onChange={(event) =>
                setVerificationCode(
                  event.target.value.toUpperCase(),
                )
              }
              maxLength={6}
              autoComplete="one-time-code"
            />

            <button
              type="submit"
              disabled={
                isLoading ||
                verificationCode.length !== 6
              }
            >
              {isLoading
                ? 'Verifying...'
                : 'Verify Account'}
            </button>

            <button type="button" onClick={() => {
              setPendingRegistrationId(null);
              setVerificationCode('');
              setErrorMessage('');
            }}
            disabled={isLoading}
            >
              Back
            </button>
          </form>
        </>
      )}
    </div>
  );
}