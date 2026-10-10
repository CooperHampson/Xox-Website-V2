import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder, type CreateOrderResponse, } from "../../api/orderApi";
import { formatPrice } from "./currency/CurrencyConverter";
import { MerchHeader } from "./components/MerchHeader";
import { useAuth } from "../../auth/AuthContext";
import { useHeaderOcclusion } from "./hooks/useHeaderOcclusion";
import "./OrderDetailsPage.css";

export function OrderDetailsPage() {
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();

  const [order, setOrder] = useState<CreateOrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const divRef = useHeaderOcclusion<HTMLDivElement>();

  useEffect(() => {
    if (!isAuthenticated || !orderId) {
      setIsLoading(false);
      return;
    }

    async function loadOrder() {
      try {
        const data = await getOrder(orderId!);
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
  }, [isAuthenticated, orderId]);

  if (!isAuthenticated) {
    return (
      <div className="background-container">
        <MerchHeader />

        <div className="orders-page-container" ref={divRef}>
          <p className="OP-title">Order Details</p>
          <p className="order-info-text">Please log in to view this order.</p>

          <Link to="/store">Back to Store</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="background-container">
        <MerchHeader />

        <div className="orders-page-container" ref={divRef}>
          <p className="OP-title">Order Not Found</p>

          <Link to="/store/orders" className="order-links">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0,);

  return (
    <>
      <title>Xoxxly Store | Order Details</title>

      <div className="background-container">
        <MerchHeader />

        <div className="orders-page-container" ref={divRef}>
          <div className="order-info-container">
            <p className="OP-title">
              {order.orderNumber}
            </p>

            <p className="order-info-text">
              Date:{" "}
              {new Date(
                order.createdAt,
              ).toLocaleString()}
            </p>

            <p className="order-info-text">
              Order Number: {order.orderNumber}
            </p>

            <p className="order-info-text">
              Status:{" "}
              {order.status.charAt(0).toUpperCase() +
                order.status.slice(1)}
            </p>

            <p className="order-info-text">
              Currency: {order.currency}
            </p>

            <p className="items-title">Items</p>

            <p className="order-info-text">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </p>

            {order.items.map((item) => (
              <div key={item.id} className="item-container">
                <p className="order-item-text">
                  {item.productName}
                </p>

                <p className="order-item-text">
                  Variant: {item.variantSku}
                </p>

                <p className="order-item-text">
                  Quantity: {item.quantity}
                </p>

                <p className="order-item-text">
                  Price:{" "}
                  {formatPrice(
                    Number(item.unitPrice),
                    order.currency,
                  )}{" "}
                  × {item.quantity} ={" "}
                  {formatPrice(
                    Number(item.unitPrice) * item.quantity,
                    order.currency,
                  )}
                </p>
              </div>
            ))}

            <p className="total-price-text">
              Total:{" "}
              {formatPrice(
                Number(order.subtotal),
                order.currency,
              )}
            </p>

            <span className="link-span">
              <Link to="/store/orders" className="order-links">
                Back to Orders
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}