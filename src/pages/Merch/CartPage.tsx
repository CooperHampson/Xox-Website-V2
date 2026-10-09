import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useCart } from "./components/cart/CartContext";
import { useCurrency } from "./currency/CurrencyContext";
import { MerchHeader } from "./components/MerchHeader";
import { convertPrice, formatPrice } from "./currency/CurrencyConverter";
import { createOrder } from "../../api/orderApi";
import { getCartSessionId } from "../../utils/cartSession";
import { useAuth } from "../../auth/AuthContext";
import { useHeaderOcclusion } from "./hooks/useHeaderOcclusion";

import "./CartPage.css";

export function CartPage() {
  const {
    cart,
    isLoading,
    updateItem,
    removeItem,
    clearCart,
    refreshCart,
  } = useCart();

  const { currentCurrency, exchangeRates } = useCurrency();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const divRef = useHeaderOcclusion<HTMLDivElement>();

  const subtotal =
    cart?.items.reduce(
      (total, item) =>
        total +
        convertPrice(
          String(Number(item.variant.price)),
          currentCurrency.code,
          exchangeRates,
        ) *
        item.quantity,
      0,
    ) ?? 0;

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
      const order = await createOrder(
        sessionId,
        currentCurrency.code,
      );

      await refreshCart();
      navigate(`/store/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Failed to create order:", error);
      setIsCheckingOut(false);
    }


  }

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (<div className="background-container"> <MerchHeader /> <div className="cart-container"> <p className="OP-title">Your cart is empty</p> </div> </div>
    );
  }

  return (
    <> <title>Xoxxly Store | Cart</title>


      <div className="background-container">
        <MerchHeader />

        <div className="cart-container" ref={divRef}>
          <span className="ct-span">
            <p className="cart-title">Cart</p>
          </span>

          <div className="cart-outer-container">
            <div className="cart-info-container">
              <button
                type="button"
                onClick={clearCart}
                className="clear-cart-button"
              >
                Clear Cart
              </button>

              {cart.items.map((item) => {
                const galleryImage =
                  item.variant.metadata?.images?.[0];

                const productImage = item.product.images?.[0];

                const image = galleryImage || productImage;

                const imageSrc = image
                  ? /^https?:\/\//i.test(image)
                    ? image
                    : `${import.meta.env.BASE_URL}${image.replace(/^\/+/, "")}`
                  : undefined;

                const itemPrice = convertPrice(
                  String(Number(item.variant.price)),
                  currentCurrency.code,
                  exchangeRates,
                );

                return (
                  <div key={item.id} className="item-container">
                    <div className="cart-item-header">
                      {imageSrc ? (
                        <img
                          className="cart-item-image"
                          src={imageSrc}
                          alt={`${item.product.name} - ${item.variant.colour ?? "default colour"}`}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="cart-item-image cart-item-image-placeholder"
                          role="img"
                          aria-label={`No image available for ${item.product.name}`}
                        />
                      )}

                      <div className="cart-item-details">
                        <p className="item-title">
                          {item.product.name}
                        </p>

                        {item.variant.colour && (
                          <p className="item-text">
                            Colour: {item.variant.colour}
                          </p>
                        )}

                        {item.variant.size && (
                          <p className="item-text">
                            Size: {item.variant.size}
                          </p>
                        )}

                        {item.variant.material && (
                          <p className="item-text">
                            Material: {item.variant.material}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="quant-div">
                      <button
                        type="button"
                        onClick={() =>
                          updateItem(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="quantity-button"
                        aria-label={`Decrease quantity of ${item.product.name}`}
                      >
                        −
                      </button>

                      <span className="item-span">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateItem(item.id, item.quantity + 1)
                        }
                        className="quantity-button"
                        aria-label={`Increase quantity of ${item.product.name}`}
                      >
                        +
                      </button>
                    </div>

                    <p className="item-text">
                      Price:{" "}
                      {formatPrice(
                        itemPrice,
                        currentCurrency.code,
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="item-remove-button"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="cart-transaction-container">
              <div className="cart-summary">
                <p className="cart-sum-title">Cart Summary</p>

                <p className="cart-sum-text">
                  Subtotal:{" "}
                  {formatPrice(
                    subtotal,
                    currentCurrency.code,
                  )}
                </p>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="checkout-button"
                >
                  {isCheckingOut ? "Processing..." : "Checkout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>


  );
}
