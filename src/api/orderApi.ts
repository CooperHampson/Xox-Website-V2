import api from './axios';

export type CreateOrderResponse = {
  id: string;
  sessionId: string;
  currency: string;
  subtotal: string;
  status: string;
  items: {
    id: string;
    productId: string;
    variantId: string;
    productName: string;
    variantSku: string;
    unitPrice: string;
    quantity: number;
  }[];
};

export async function createOrder(
  sessionId: string,
  currency: string,
  exchangeRate: number,
): Promise<CreateOrderResponse> {
  const response =
    await api.post<CreateOrderResponse>(
      `/orders?sessionId=${sessionId}`,
      {
        currency,
        exchangeRate,
      },
    );

  return response.data;
}