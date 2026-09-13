import { useState } from "react";
import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";
import { MerchFilter } from "../filters/MerchFilter";
import { MerchData } from "../components/MerchData";

import { defaultMerchFilters, type MerchFilters } from "../filters/MerchFilters";
import { filterMerch } from "../filters/FilterMerch";

import './CategoryPages.css';

export function ShirtsPage() {
  const [filters, setFilters] = useState<MerchFilters>(defaultMerchFilters);

  const shirtItems = MerchData.filter((item) => item.category === 'shirts');

  const filteredItems = filterMerch(shirtItems, filters);
  return (
    <>
      <title>Xoxxly | Merch Shirts</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">Shirts</p>

        <MerchFilter filters={filters} onFiltersChange={setFilters} />

        <StoreLayout category="shirts" items={filteredItems} />
      </div>
    </>
  );
}