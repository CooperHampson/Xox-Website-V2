import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { AuthUser } from '../api/authApi';

import { getCurrentUser } from '../api/authApi';

type AuthContextType = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (
    user: AuthUser,
    accessToken: string,
  ) => void;
  logout: () => void;
};

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const AUTH_STORAGE_KEY = 'xox_auth';

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(
    null,
  );

  const [accessToken, setAccessToken] = useState<
    string | null
  >(null);

  useEffect(() => {
  const storedAuth =
    localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedAuth) {
    return;
  }

  const parsedAuth = JSON.parse(storedAuth);

  setUser(parsedAuth.user);
  setAccessToken(parsedAuth.accessToken);

  getCurrentUser()
    .then((currentUser) => {
      setUser(currentUser);

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: currentUser,
          accessToken: parsedAuth.accessToken,
        }),
      );
    })
    .catch(() => {
      setUser(null);
      setAccessToken(null);

      localStorage.removeItem(
        AUTH_STORAGE_KEY,
      );
    });
}, []);

  function login(
    user: AuthUser,
    accessToken: string,
  ) {
    setUser(user);
    setAccessToken(accessToken);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user,
        accessToken,
      }),
    );
  }

  function logout() {
    setUser(null);
    setAccessToken(null);

    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}