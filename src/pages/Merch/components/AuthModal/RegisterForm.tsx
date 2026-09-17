import { useState } from 'react';
import axios from 'axios';

import { registerUser } from '../../../../api/authApi';
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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage('');
    setIsLoading(true);
    try {
      const result = await registerUser({
        username,
        email,
        password,
      });

      login(result.user, result.accessToken,);

      onRegisterSuccess();
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

  return (
    <div>
      <h3>Create Account</h3>

      {errorMessage && (
        <p className="auth-error">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit}>
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
    </div>
  );
}