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

        {isLogin ? (
          <LoginForm
            onRegisterClick={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onLoginClick={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
}