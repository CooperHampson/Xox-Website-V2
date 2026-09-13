import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";

import './CategoryPages.css';

export function PantsPage() {
  return (
    <>
      <title>Xoxxly | Merch Pants</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">Pants</p>
        <StoreLayout category="pants" />
      </div>
    </>
  );
}