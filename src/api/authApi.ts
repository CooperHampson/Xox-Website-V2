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
  image: string | null;
  createdAt: string;
  usernameUpdatedAt: string | null;
  emailUpdatedAt: string | null;
  passwordUpdatedAt: string | null;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type StartRegistrationResponse = {
  pendingRegistrationId: number;
};

export type VerifyRegistrationData = {
  pendingRegistrationId: number;
  verificationCode: string;
};

export type VerifyRegistrationResponse = {
  accessToken: string;
  user: AuthUser;
};

export type ResendRegistrationData = {
  pendingRegistrationId: number;
};

export type ResendRegistrationResponse = {
  message: string;
};

export type ResetPasswordData = {
  token: string;
  password: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type ForgotPasswordData = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export async function startRegistration(data: RegisterData) {
  const response = await api.post<StartRegistrationResponse>('/users/register', data);

  return response.data;
}

export async function verifyRegistration(data: VerifyRegistrationData,) {
  const response = await api.post<VerifyRegistrationResponse>('/users/register/verify', data,);

  return response.data;
}

export async function resendRegistrationCode(
  data: ResendRegistrationData,
) {
  const response =
    await api.post<ResendRegistrationResponse>(
      '/users/register/resend',
      data,
    );

  return response.data;
}

export async function resetPassword(
  data: ResetPasswordData,
) {
  const response =
    await api.post<ResetPasswordResponse>(
      '/users/reset-password',
      data,
    );

  return response.data;
}

export async function requestPasswordReset(
  data: ForgotPasswordData,
) {
  const response =
    await api.post<ForgotPasswordResponse>(
      '/users/forgot-password',
      data,
    );

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

export async function updateProfileImage(
  file: File,
) {
  const formData = new FormData();

  formData.append('image', file);

  const response = await api.patch(
    '/users/me/image',
    formData,
  );

  return response.data;
}

export async function removeProfileImage() {
  const response = await api.delete(
    '/users/me/image',
  );

  return response.data;
}