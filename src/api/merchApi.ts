import api from './axios';
import type { MerchItem, MerchProductVariant, } from '../types/merch';

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

export async function getMerchVariants(
  productId: string,
): Promise<MerchProductVariant[]> {
  const response = await api.get<MerchProductVariant[]>(
    `/merch/${productId}/variants`,
  );

  return response.data;
}