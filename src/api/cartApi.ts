import api from './axios';

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    images: string[];
  };
  variant: {
    id: string;
    sku: string;
    name?: string | null;
    colour?: string | null;
    size?: string | null;
    material?: string | null;
    isSoldOut: boolean;
    isPublished: boolean;
  };
};

export type Cart = {
  id: string;
  sessionId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export async function getCart(sessionId: string): Promise<Cart> {
  const response = await api.get<Cart>('/cart', {
    params: {
      sessionId,
    },
  });

  return response.data;
}

export async function addToCart(
  sessionId: string,
  variantId: string,
  quantity: number,
): Promise<CartItem> {
  const response = await api.post<CartItem>('/cart/items', {
    sessionId,
    variantId,
    quantity,
  });

  return response.data;
}

export async function updateCartItem(
  sessionId: string,
  itemId: string,
  quantity: number,
): Promise<CartItem> {
  const response = await api.patch<CartItem>(
    `/cart/items/${itemId}`,
    {
      quantity,
    },
    {
      params: {
        sessionId,
      },
    },
  );

  return response.data;
}

export async function removeCartItem(
  sessionId: string,
  itemId: string,
): Promise<CartItem> {
  const response = await api.delete<CartItem>(
    `/cart/items/${itemId}`,
    {
      params: {
        sessionId,
      },
    },
  );

  return response.data;
}

export async function clearCart(sessionId: string): Promise<Cart> {
  const response = await api.delete<Cart>('/cart', {
    params: {
      sessionId,
    },
  });

  return response.data;
}
