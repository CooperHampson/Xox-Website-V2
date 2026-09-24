import { Link, useParams } from "react-router-dom";
import './OrderConfirmationPage.css'

export default function OrderConfirmationPage() {
  const { orderId } = useParams();

  return (
    <div>
      <h1>Order Confirmed</h1>

      <p>
        Thank you for your order.
      </p>

      <p>
        Order ID: {orderId}
      </p>

      <Link to="/store">
        Continue Shopping
      </Link>
    </div>
  );
}