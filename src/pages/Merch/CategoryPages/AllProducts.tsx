import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";

import './CategoryPages.css';

export function AllProducts() {
  return (
    <>
      <title>Xoxxly | Merch All Products</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">All Products</p>
        <StoreLayout />
      </div>
    </>
  );
}