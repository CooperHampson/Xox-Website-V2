import { useNavigate } from "react-router-dom";
import { useCart } from "./components/cart/CartContext";
import { useCurrency } from "./currency/CurrencyContext";
import { MerchHeader } from "./components/MerchHeader";
import { convertPrice, formatPrice } from "./currency/CurrencyConverter";
import { createOrder } from "../../api/orderApi";
import { getCartSessionId } from "../../utils/cartSession";
import { useAuth } from "../../auth/AuthContext";
import './CartPage.css';
import { useState } from "react";
import { useHeaderOcclusion } from "./hooks/useHeaderOcclusion";

export function CartPage() {
  const { cart, isLoading, updateItem, removeItem, clearCart, refreshCart, } = useCart();
  const { currentCurrency, exchangeRates } = useCurrency();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const divRef = useHeaderOcclusion<HTMLDivElement>();

  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`
  };

  const subtotal =
    cart?.items.reduce(
      (total, item) => total + convertPrice(
        item.product.price,
        currentCurrency.code,
        exchangeRates,
      ) * item.quantity, 0,
    ) ?? 0;

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <div className="background-container" style={bgImageUrl}>
          <MerchHeader />

          <div className="cart-container">
            <p className="OP-title">Your cart is empty</p>
          </div>
        </div>
      </>
    );
  }

  async function handleCheckout() {
    if (!isAuthenticated) {
      navigate("/store", {
        state: { openAuthModal: true },
      });
      return;
    }

    if (isCheckingOut) {
      return;
    }

    setIsCheckingOut(true);

    try {
      const sessionId = getCartSessionId();

      const order = await createOrder(sessionId, currentCurrency.code,);

      console.log("Order created:", order);

      await refreshCart();

      navigate(`/store/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Failed to create order:", error);

      setIsCheckingOut(false);
    }
  }

  return (
    <>
      <title>Xoxxly Store | Cart</title>

      <div className="background-container" style={bgImageUrl}>
        <MerchHeader />

        <div className="cart-container" ref={divRef}>
          <p className="cart-title">Cart</p>

          <div className="cart-outer-container">
            <div className="cart-info-container">
              <button type="button" onClick={clearCart} className="clear-cart-button">Clear Cart</button>

              {cart.items.map((item) => (
                <div key={item.id} className="item-container">
                  <p className="item-title">{item.product.name}</p>

                  <p className="item-text">
                    {item.variant.colour &&
                      `Colour: ${item.variant.colour}`}
                  </p>

                  <p className="item-text">
                    {item.variant.size &&
                      `Size: ${item.variant.size}`}
                  </p>

                  <div className="quant-div">
                    <button type="button" onClick={() => updateItem(item.id, item.quantity - 1,)} disabled={item.quantity <= 1} className="quantity-button">
                      −
                    </button>

                    <span className="item-span">{item.quantity}</span>

                    <button type="button" onClick={() => updateItem(item.id, item.quantity + 1,)} className="quantity-button">
                      +
                    </button>
                  </div>

                  <p className="item-text">Price:{" "}{formatPrice(convertPrice(item.product.price, currentCurrency.code, exchangeRates), currentCurrency.code)}</p>

                  <button type="button" onClick={() => removeItem(item.id)} className="item-remove-button">Remove</button>
                </div>
              ))}
            </div>

            <div className="cart-transaction-container">
              <div className="cart-summary">
                <p className="cart-sum-title">Cart Summary</p>
                <p className="cart-sum-text">
                  Subtotal:{" "} {formatPrice(subtotal, currentCurrency.code)}
                </p>

                <button type="button" onClick={handleCheckout} disabled={isCheckingOut} className="checkout-button">Checkout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
