import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";

import './CategoryPages.css';

export function HoodiesPage() {
  return (
    <>
      <title>Xoxxly | Merch Hoodies</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">Hoodies</p>
        <StoreLayout category="hoodies" />
      </div>
    </>
  );
}