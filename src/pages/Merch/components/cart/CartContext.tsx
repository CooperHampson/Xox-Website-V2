
import { createContext, useContext, useEffect, useState, type ReactNode, } from "react";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart, type Cart } from "../../../../api/cartApi";
import { getCartSessionId } from "../../../../utils/cartSession";

type CartContextValue = {
  cart: Cart | null;
  isLoading: boolean;

  refreshCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined,);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children, }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshCart() {
    try {
      const sessionId = getCartSessionId();
      const currentCart = await getCart(sessionId);

      setCart(currentCart);
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  }

  async function addItem(variantId: string, quantity: number) {
    const sessionId = getCartSessionId();

    await addToCart(sessionId, variantId, quantity,);

    await refreshCart();
  }

  async function updateItem(itemId: string, quantity: number) {
    const sessionId = getCartSessionId();

    await updateCartItem(sessionId, itemId, quantity,);

    await refreshCart();
  }

  async function removeItem(itemId: string) {
    const sessionId = getCartSessionId();

    await removeCartItem(sessionId, itemId,);

    await refreshCart();
  }

  async function handleClearCart() {
    const sessionId = getCartSessionId();

    await clearCart(sessionId);

    await refreshCart();
  }

  useEffect(() => {
    async function loadCart() {
      try {
        await refreshCart();
      } finally {
        setIsLoading(false);
      }
    }

    loadCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, isLoading, refreshCart, addItem, updateItem, removeItem, clearCart: handleClearCart, }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}