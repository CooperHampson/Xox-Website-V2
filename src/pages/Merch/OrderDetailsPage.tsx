import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder, type CreateOrderResponse,} from "../../api/orderApi";
import { formatPrice } from "./currency/CurrencyConverter";
import { MerchHeader } from "./components/MerchHeader";
import { useAuth } from "../../auth/AuthContext";
import "./OrdersPage.css";

export function OrderDetailsPage() {
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();

  const [order, setOrder] = useState<CreateOrderResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

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

  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`,
  };

  if (!isAuthenticated) {
    return (
      <div className="background-container" style={bgImageUrl}>
        <MerchHeader />

        <div className="orders-page-container">
          <h1>Order Details</h1>
          <p>Please log in to view this order.</p>

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
      <div className="background-container" style={bgImageUrl}>
        <MerchHeader />

        <div className="orders-page-container">
          <h1>Order Not Found</h1>

          <Link to="/store/orders">
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

      <div className="background-container" style={bgImageUrl}>
        <MerchHeader />

        <div className="orders-page-container">
          <h1>
            Order #{order.id.slice(0, 8)}
          </h1>

          <p>
            Date:{" "}
            {new Date(
              order.createdAt,
            ).toLocaleString()}
          </p>

          <p>
            Status:{" "}
            {order.status.charAt(0).toUpperCase() +
              order.status.slice(1)}
          </p>

          <p>
            Currency: {order.currency}
          </p>

          <h2>Items</h2>

          <p>
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>

          {order.items.map((item) => (
            <div key={item.id}>
              <p>
                {item.productName}
              </p>

              <p>
                Variant: {item.variantSku}
              </p>

              <p>
                Quantity: {item.quantity}
              </p>

              <p>
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

          <h2>
            Total:{" "}
            {formatPrice(
              Number(order.subtotal),
              order.currency,
            )}
          </h2>

          <Link to="/store/orders">
            Back to Orders
          </Link>
        </div>
      </div>
    </>
  );
}