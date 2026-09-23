import { useCart } from "./components/cart/CartContext";
import { useCurrency } from "./currency/CurrencyContext";
import { MerchHeader } from "./components/MerchHeader";
import { convertPrice, formatPrice } from "./currency/CurrencyConverter";
import './CartPage.css';

export function CartPage() {
  const { cart, isLoading, updateItem, removeItem, clearCart, } = useCart();
  const { currentCurrency, exchangeRates } = useCurrency();

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
    return <div>Your cart is empty.</div>;
  }

  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`
  };

  return (
    <>
      <title>Xoxxly Store | Cart</title>

      <div className="background-container" style={bgImageUrl}>
        <MerchHeader />

        <div className="cart-container">
          <h1>Cart</h1>

          <button type="button" onClick={clearCart}>Clear Cart</button>

          {cart.items.map((item) => (
            <div key={item.id}>
              <h2>{item.product.name}</h2>

              <p>
                {item.variant.colour &&
                  `Colour: ${item.variant.colour}`}
              </p>

              <p>
                {item.variant.size &&
                  `Size: ${item.variant.size}`}
              </p>

              <div>
                <button type="button" onClick={() => updateItem(item.id, item.quantity - 1,)} disabled={item.quantity <= 1}>
                  −
                </button>

                <span>{item.quantity}</span>

                <button type="button" onClick={() => updateItem(item.id, item.quantity + 1,)}>
                  +
                </button>
              </div>

              <p>Price:{" "}{formatPrice(convertPrice(item.product.price, currentCurrency.code, exchangeRates), currentCurrency.code)}</p>

              <button type="button" onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}

          <div className="cart-summary">
            <h2>Cart Summary</h2>
            <p>
              Subtotal:{" "} {formatPrice(subtotal, currentCurrency.code)}
            </p>

            <button type="button">Checkout</button> </div>
        </div>
      </div>
    </>
  );
}
