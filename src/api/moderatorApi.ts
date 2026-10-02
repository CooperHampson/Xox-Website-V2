import api from './axios';

export type ModeratorAccess = {
  userId: number;
  role: 'MODERATOR' | 'ADMIN';
  access: boolean;
};

export async function getModeratorAccess(): Promise<ModeratorAccess> {
  const response = await api.get<ModeratorAccess>('/moderator/access');
  return response.data;
}