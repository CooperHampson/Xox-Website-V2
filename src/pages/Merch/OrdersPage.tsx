import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, type CreateOrderResponse } from "../../api/orderApi";
import { formatPrice } from "./currency/CurrencyConverter";
import { MerchHeader } from "./components/MerchHeader";
import { useAuth } from "../../auth/AuthContext";
import './OrdersPage.css';

export function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<CreateOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`
  };

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getMyOrders();

        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error,);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <>
        <div className="background-container" style={bgImageUrl}>
          <MerchHeader />

          <div className="orders-page-container">
            <h1>My Orders</h1>
            <p>Please log in to view your orders.</p>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  return (
    <>
      <title>Xoxxly Store | Orders Page</title>

      <div className="background-container" style={bgImageUrl}>
        <MerchHeader />

        <div className="orders-page-container">
          <h1>My Orders</h1>

          {orders.length === 0 ? (
            <div>
              <p>You havent placed any orders yet.</p>

              <Link to="/store">Start Shopping</Link>
            </div>
          ) : (
            <div>
              {orders.map((order) => (
                <div key={order.id}>
                  <h2>
                    <Link to={`/store/orders/${order.id}`} className="order-links">
                      Order #{order.id.slice(0, 8)}
                    </Link>
                  </h2>
                  
                  <p>Status:{" "}{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>

                  <p>Total:{" "}{formatPrice(Number(order.subtotal), order.currency,)}</p>

                  <p>Date:{" "}{new Date(order.createdAt).toLocaleString()}</p>

                  <p>Items:{" "}{order.items.reduce((total, item) => total + item.quantity, 0,)}</p>

                  <Link to={`/store/orders/${order.id}`}>View Order</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </>
  );
}