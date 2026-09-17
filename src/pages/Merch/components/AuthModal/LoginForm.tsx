import { useState } from 'react';
import axios from 'axios';

import { loginUser } from '../../../../api/authApi';
import { useAuth } from '../../../../auth/AuthContext';

type LoginFormProps = {
  onRegisterClick: () => void;
  onLoginSuccess: () => void;
  onForgotPasswordClick: () => void;
};

export default function LoginForm({
  onRegisterClick,
  onLoginSuccess,
  onForgotPasswordClick,
}: LoginFormProps) {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage('');
    setIsLoading(true);
    try {
      const result = await loginUser({
        identifier,
        password,
      });

      login(result.user, result.accessToken,);

      onLoginSuccess();
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setErrorMessage(
            'Unable to connect to the server.',
          );
        } else {
          setErrorMessage(
            'Invalid username/email or password.',
          );
        }
      } else {
        setErrorMessage(
          'Something went wrong. Please try again.',
        );
      }

      setIdentifier('');
      setPassword('');

      setIsLoading(false);
    }
  }

  return (
    <div>
      <h3>Login</h3>

      {errorMessage && (
        <p className="auth-error">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-identifier">
          Username or Email
        </label>

        <input
          id="login-identifier"
          type="text"
          placeholder="Username or email"
          value={identifier}
          onChange={(event) =>
            setIdentifier(event.target.value)
          }
        />

        <label htmlFor="login-password">
          Password
        </label>

        <input
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
        />

        <button
          type="button"
          onClick={onForgotPasswordClick}
        >
          Forgot Password?
        </button>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p>Don't have an account?</p>

      <button
        type="button"
        onClick={onRegisterClick}
      >
        Create an account
      </button>
    </div>
  );
}