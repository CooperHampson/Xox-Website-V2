import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPrice } from "./currency/CurrencyConverter";
import { useAuth } from "../../auth/AuthContext";
import { getOrder, type CreateOrderResponse, } from "../../api/orderApi";
import { MerchHeader } from "./components/MerchHeader";
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
  const { isAuthenticated } = useAuth();
  const { orderId } = useParams();
  const [order, setOrder] = useState<CreateOrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    async function loadOrder() {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (error) {
        console.error(
          "Failed to load order:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <>
        <div className="background-container" style={bgImageUrl}>
          <MerchHeader />

          <div className="order-conf-container">
            <h1>Order Confirmation</h1>
            <p>Please Log in to view this order.</p>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return <div>Loading order...</div>;
  }

  if (!order) {
    return (
      <div>
        <h1>Order not found</h1>

        <Link to="/store">
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <>
      <title>Xoxxly Store | Order Confirmation</title>

      <div className="background-container" style={bgImageUrl}>
        <MerchHeader />

        <div className="order-conf-container">
          <h1>Order Confirmed</h1>

          <p>
            Thank you for your order.
          </p>

          <p>
            Order ID: {order.id}
          </p>

          <p>
            Status:{" "}{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </p>

          <h2>Items</h2>

          {order.items.map((item) => (
            <div key={item.id}>
              <p>
                {item.productName}
              </p>

              <p>
                SKU: {item.variantSku}
              </p>

              <p>
                Quantity: {item.quantity}
              </p>

              <p>
                Price:{" "}{formatPrice(Number(item.unitPrice), order.currency)}
              </p>
            </div>
          ))}

          <h2>
            Total:{" "}{formatPrice(Number(order.subtotal), order.currency)}
          </h2>

          <Link to="/store">
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}
