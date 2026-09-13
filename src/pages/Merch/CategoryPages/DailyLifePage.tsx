import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";

import './CategoryPages.css';

export function DailyLifePage() {
  return (
    <>
      <title>Xoxxly | Merch Daily Life</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">Daily Life</p>
        <StoreLayout category="daily life" />
      </div>
    </>
  );
}