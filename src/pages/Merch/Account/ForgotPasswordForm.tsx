import { useState } from 'react';
import axios from 'axios';

import { requestPasswordReset } from '../../../api/authApi';

type ForgotPasswordFormProps = {
  onLoginClick: () => void;
};

export default function ForgotPasswordForm({
  onLoginClick,
}: ForgotPasswordFormProps) {
  const [email, setEmail] =
    useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage('');
    setIsLoading(true);

    try {
      await requestPasswordReset({
        email,
      });

      setIsSubmitted(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setErrorMessage(
            'Unable to connect to the server.',
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

  if (isSubmitted) {
    return (
      <div className="forgot-password-form">
        <h3>Check Your Email</h3>

        <p>
          If an account exists with that email,
          a password reset link will be sent.
        </p>

        <button
          type="button"
          onClick={onLoginClick}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="forgot-password-form">
      <h3>Forgot Password?</h3>

      <p>
        Enter your email address and we'll
        send you a password reset link.
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          Email

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </label>

        {errorMessage && (
          <p>{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? 'Sending...'
            : 'Send Reset Link'}
        </button>
      </form>

      <button
        type="button"
        onClick={onLoginClick}
      >
        Back to Login
      </button>
    </div>
  );
}