import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";

import './CategoryPages.css';

export function ShirtsPage() {
  return (
    <>
      <title>Xoxxly | Merch Shirts</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">Shirts</p>
        <StoreLayout category="shirts" />
      </div>
    </>
  );
}