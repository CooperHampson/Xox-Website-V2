import { useState } from "react";
import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";
import { MerchFilter } from "../filters/MerchFilter";
import { MerchData } from "../components/MerchData";

import { defaultMerchFilters, type MerchFilters } from "../filters/MerchFilters";
import { filterMerch } from "../filters/FilterMerch";
import './CategoryPages.css';

export function FootwearPage() {
  const [filters, setFilters] = useState<MerchFilters>(defaultMerchFilters);

  const footwearItems = MerchData.filter((item) => item.category === 'footwear');

  const filteredItems = filterMerch(footwearItems, filters);

  return (
    <>
      <title>Xoxxly | Merch Footwear</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">Footwear</p>
        
        <MerchFilter filters={filters} onFiltersChange={setFilters} />

        <StoreLayout category="footwear" items={filteredItems} />
      </div>
    </>
  );
}