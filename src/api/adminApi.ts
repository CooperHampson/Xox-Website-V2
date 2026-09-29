import api from './axios';

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  usernameUpdatedAt: string | null;
  emailUpdatedAt: string | null;
  passwordUpdatedAt: string | null;
};

export async function getAdminUsers() {
  const response = await api.get<AdminUser[]>('/admin/users');
  return response.data;
}

export async function updateAdminUserRole(
  userId: number,
  role: AdminUser['role'],
) {
  const response = await api.patch<AdminUser>(
    `/admin/users/${userId}/role`,
    { role },
  );

  return response.data;
}

export async function deactivateAdminUser(userId: number) {
  const response = await api.patch<AdminUser>(
    `/admin/users/${userId}/deactivate`,
  );

  return response.data;
}

export async function activateAdminUser(userId: number) {
  const response = await api.patch<AdminUser>(
    `/admin/users/${userId}/activate`,
  );

  return response.data;
}