import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPrice } from "./currency/CurrencyConverter";

import { getOrder, type CreateOrderResponse, } from "../../api/orderApi";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();

  const [order, setOrder] =
    useState<CreateOrderResponse | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
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
  }, [orderId]);

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

  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`
  };

  return (
    <>
      <title>Xoxxly Store | Order Confirmation</title>

      <div className="background-container" style={bgImageUrl}>
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
