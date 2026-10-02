import api from './axios';

import type {
  MerchItem,
  MerchProductVariant,
} from '../types/merch';

export type MerchQuery = {
  featured?: boolean;
  category?: string;
  promotion?: boolean;
};

export type CreateMerchVariantInput = {
  sku: string;
  name?: string;
  colour?: string;
  size?: string;
  material?: string;
  isSoldOut?: boolean;
  isPublished?: boolean;
};

export type UpdateMerchVariantInput =
  Partial<CreateMerchVariantInput>;

export async function getMerch(
  query?: MerchQuery,
) {
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

export async function getAdminMerchProducts() {
  const response = await api.get<MerchItem[]>('/merch/admin');

  return response.data;
}

export async function getAdminMerchVariants(
  productId: string,
): Promise<MerchProductVariant[]> {
  const response = await api.get<MerchProductVariant[]>(
    `/merch/admin/${productId}/variants`,
  );

  return response.data;
}

export async function createMerchVariant(
  productId: string,
  data: CreateMerchVariantInput,
): Promise<MerchProductVariant> {
  const response = await api.post<MerchProductVariant>(
    `/merch/${productId}/variants`,
    data,
  );

  return response.data;
}

export async function updateMerchVariant(
  productId: string,
  variantId: string,
  data: UpdateMerchVariantInput,
): Promise<MerchProductVariant> {
  const response = await api.patch<MerchProductVariant>(
    `/merch/${productId}/variants/${variantId}`,
    data,
  );

  return response.data;
}

export async function deleteMerchVariant(
  productId: string,
  variantId: string,
): Promise<void> {
  await api.delete(
    `/merch/${productId}/variants/${variantId}`,
  );
}

export type CreateMerchProductInput = {
  name: string;
  price: number;
  category: string;
  featured?: boolean;
  description: string;
  images: string[];
  details?: string[];
  tags?: string[];
  colours?: string[];
  materials?: string[];
  isOnPromotion?: boolean;
  promotionPrice?: number;
  isSoldOut?: boolean;
  isPublished?: boolean;
};

export type UpdateMerchProductInput =
  Partial<CreateMerchProductInput>;

export async function createMerchProduct(
  data: CreateMerchProductInput,
): Promise<MerchItem> {
  const response = await api.post<MerchItem>(
    '/merch',
    data,
  );

  return response.data;
}

export async function updateMerchProduct(
  productId: string,
  data: UpdateMerchProductInput,
): Promise<MerchItem> {
  const response = await api.patch<MerchItem>(
    `/merch/${productId}`,
    data,
  );

  return response.data;
}

export async function deleteMerchProduct(
  productId: string,
): Promise<void> {
  await api.delete(`/merch/${productId}`);
}

export async function getOrderAgainMerch(): Promise<MerchItem[]> {
  const response = await api.get<MerchItem[]>(
    '/merch/order-again',
  );

  return response.data;
}