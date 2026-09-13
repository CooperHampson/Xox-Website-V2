import { useState } from "react";
import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";
import { MerchFilter } from "../filters/MerchFilter";
import { MerchData } from "../components/MerchData";

import { defaultMerchFilters, type MerchFilters } from "../filters/MerchFilters";
import { filterMerch } from "../filters/FilterMerch";

import './CategoryPages.css';

export function HoodiesPage() {
  const [filters, setFilters] = useState<MerchFilters>(defaultMerchFilters);

  const hoodiesItems = MerchData.filter((item) => item.category === 'pants');

  const filteredItems = filterMerch(hoodiesItems, filters);

  return (
    <>
      <title>Xoxxly | Merch Hoodies</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">Hoodies</p>
        
        <MerchFilter filters={filters} onFiltersChange={setFilters} />

        <StoreLayout category="hoodies" items={filteredItems} />
      </div>
    </>
  );
}