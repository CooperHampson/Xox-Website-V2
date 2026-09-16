import { useState } from 'react';

import { registerUser } from '../../../../api/authApi';

type RegisterFormProps = {
  onLoginClick: () => void;
};

export default function RegisterForm({
  onLoginClick,
}: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      const user = await registerUser({
        username,
        email,
        password,
      });

      console.log(user);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h3>Create Account</h3>

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

        <button type="submit">
          Create Account
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