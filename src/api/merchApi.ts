import api from './axios';
import type { MerchItem } from '../types/merch';

export type MerchQuery = {
  featured?: boolean;
  category?: string;
  promotion?: boolean;
};

export async function getMerch(query?: MerchQuery) {
  const response = await api.get<MerchItem[]>('/merch', {
    params: query,
  });

  return response.data;
}