import api from './axios';

export type RegisterData = {
  username: string;
  email: string;
  password: string;
};

export type LoginData = {
  identifier: string;
  password: string;
};

export type UpdateUserData = {
  username?: string;
  email?: string;
  password?: string;
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  usernameUpdatedAt: string | null;
  emailUpdatedAt: string | null;
  passwordUpdatedAt: string | null;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type RegisterResponse = {
  accessToken: string;
  user: AuthUser;
};

export async function registerUser(data: RegisterData) {
  const response = await api.post<RegisterResponse>('/users', data);

  return response.data;
}

export async function loginUser(data: LoginData) {
  const response = await api.post<LoginResponse>(
    '/users/login',
    data,
  );

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get<AuthUser>('/users/me',);

  return response.data;
}

export async function updateCurrentUser(data: UpdateUserData,) {
  const response = await api.patch<AuthUser>('/users/me', data,);

  return response.data;
}