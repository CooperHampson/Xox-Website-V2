import { useState } from 'react';

import { loginUser } from '../../../../api/authApi';
import { useAuth } from '../../../../auth/AuthContext';

type LoginFormProps = {
  onRegisterClick: () => void;
};

export default function LoginForm({
  onRegisterClick,
}: LoginFormProps) {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      const result = await loginUser({
        identifier,
        password,
      });

      login(result.user, result.accessToken,);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h3>Login</h3>

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

        <button type="submit">
          Login
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