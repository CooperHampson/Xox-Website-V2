import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";

import './CategoryPages.css';

export function FootwearPage() {
  return (
    <>
      <title>Xoxxly | Merch Footwear</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">Footwear</p>
        <StoreLayout category="footwear" />
      </div>
    </>
  );
}