import { useState } from 'react';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

import './AuthModal.css';

type AuthModalProps = {
  onClose: () => void;
};

export function AuthModal({
  onClose,
}: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [registerSuccessful, setRegisterSuccessful] = useState(false);

  function handleLoginSuccess() {
    setLoginSuccessful(true);

    setTimeout(() => {
      onClose();
    }, 3000);
  }

  function handleRegisterSuccess() {
    setRegisterSuccessful(true);

    setTimeout(() => {
      onClose();
    }, 3000);
  }

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {loginSuccessful ? (
          <div className="auth-login-success">
            <p>Logged in successfully</p>
          </div>
        ) : registerSuccessful ? (
          <div className="auth-register-success">
            <p>Created account successfully</p>
          </div>
        ) : isLogin ? (
          <LoginForm
            onRegisterClick={() => setIsLogin(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <RegisterForm
            onLoginClick={() => setIsLogin(true)}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
      </div>
    </div>
  );
}