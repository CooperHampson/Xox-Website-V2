import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, type CreateOrderResponse } from "../../api/orderApi";
import { formatPrice } from "./currency/CurrencyConverter";
import { MerchHeader } from "./components/MerchHeader";
import { useAuth } from "../../auth/AuthContext";
import { useHeaderOcclusion } from "./hooks/useHeaderOcclusion";
import './OrdersPage.css';

export function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<CreateOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const divRef = useHeaderOcclusion<HTMLDivElement>();

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

          <div className="orders-page-container" ref={divRef}>
            <p className="OP-title">My Orders</p>
            <p className="order-info-text">Please log in to view your orders.</p>
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

        <div className="orders-page-container" ref={divRef}>
          <p className="OP-title">My Orders</p>

          {orders.length === 0 ? (
            <div>
              <p className="order-info-text">You havent placed any orders yet.</p>

              <Link to="/store" className="shopping-link">Start Shopping</Link>
            </div>
          ) : (
            <div>
              {orders.map((order) => (
                <div key={order.id} className="order-container">

                  <span className="link-span">
                    <Link to={`/store/orders/${order.id}`} className="order-links">
                      {order.orderNumber}
                    </Link>
                  </span>

                  <p className="order-info-text">Status:{" "}{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>

                  <p className="order-info-text">Total:{" "}{formatPrice(Number(order.subtotal), order.currency,)}</p>

                  <p className="order-info-text">Date:{" "}{new Date(order.createdAt).toLocaleString()}</p>

                  <p className="order-info-text">Items:{" "}{order.items.reduce((total, item) => total + item.quantity, 0,)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </>
  );
}