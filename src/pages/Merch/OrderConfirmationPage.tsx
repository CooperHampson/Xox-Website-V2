import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPrice } from "./currency/CurrencyConverter";
import { useAuth } from "../../auth/AuthContext";
import { getOrder, type CreateOrderResponse, } from "../../api/orderApi";
import { MerchHeader } from "./components/MerchHeader";
import { useHeaderOcclusion } from "./hooks/useHeaderOcclusion";
import './OrderDetailsPage.css';

export default function OrderConfirmationPage() {
  const { isAuthenticated } = useAuth();
  const { orderId } = useParams();
  const [order, setOrder] = useState<CreateOrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const divRef = useHeaderOcclusion<HTMLDivElement>();

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
        <div className="background-container">
          <MerchHeader />

          <div className="orders-page-container" ref={divRef}>
            <p className="OP-title">Order Confirmation</p>
            <p className="order-info-text">Please Log in to view this order.</p>
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
        <p className="OP-title">Order not found</p>

        <Link to="/store" className="order-links">
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <>
      <title>Xoxxly Store | Order {order.orderNumber}</title>

      <div className="background-container">
        <MerchHeader />

        <div className="orders-page-container" ref={divRef}>
          <div className="order-info-container">
            <p className="OP-title">Order Confirmed</p>

            <p className="order-info-text">
              Thank you for your order.
            </p>

            <p className="order-info-text">
              Order ID: {order.orderNumber}
            </p>

            <p className="order-info-text">
              Status:{" "}{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </p>

            <p className="items-title">Items</p>

            {order.items.map((item) => (
              <div key={item.id} className="item-container">
                <p className="order-item-text">
                  {item.productName}
                </p>

                <p className="order-item-text">
                  SKU: {item.variantSku}
                </p>

                <p className="order-item-text">
                  Quantity: {item.quantity}
                </p>

                <p className="order-item-text">
                  Price:{" "}{formatPrice(Number(item.unitPrice), order.currency)}
                </p>
              </div>
            ))}

            <p className="total-price-text">
              Total:{" "}{formatPrice(Number(order.subtotal), order.currency)}
            </p>

            <span>
              <Link to="/store" className="order-links">
                Continue Shopping
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
