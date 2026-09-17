import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

import { resetPassword } from '../../../api/authApi';
import './ResetPassword.css';

export default function ResetPassword() {
  const [searchParams] =
    useSearchParams();

  const token = searchParams.get('token');

  const [password, setPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSuccess, setIsSuccess] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage('');

    if (!token) {
      setErrorMessage(
        'This password reset link is invalid.',
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        'Passwords do not match.',
      );
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({
        token,
        password,
      });

      setIsSuccess(true);
    } catch (error) {
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
            'This password reset link is invalid or has expired.',
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h1>Reset Password</h1>

        {!token ? (
          <p className="reset-password-message">
            This password reset link is invalid.
          </p>
        ) : isSuccess ? (
          <p className="reset-password-message">
            Your password has been reset
            successfully.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              New Password

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                minLength={8}
                required
              />
            </label>

            <label>
              Confirm Password

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                minLength={8}
                required
              />
            </label>

            {errorMessage && (
              <p className="reset-password-message">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? 'Resetting...'
                : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

