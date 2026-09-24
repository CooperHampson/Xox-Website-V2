import api from './axios';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export type CreateOrderResponse = {
  id: string;
  sessionId: string;
  currency: string;
  subtotal: string;
  status: OrderStatus;
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

export async function getOrder(
  orderId: string,
): Promise<CreateOrderResponse> {
  const response =
    await api.get<CreateOrderResponse>(
      `/orders/${orderId}`,
    );

  return response.data;
}
