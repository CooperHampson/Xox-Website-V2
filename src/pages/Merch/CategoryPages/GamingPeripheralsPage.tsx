import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";

import './CategoryPages.css';

export function GamingPeripheralsPage() {
  return (
    <>
      <title>Xoxxly | Merch Gaming Perhipherals</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">Gaming Peripherals</p>
        <StoreLayout category="gaming peripherals" />
      </div>
    </>
  );
}