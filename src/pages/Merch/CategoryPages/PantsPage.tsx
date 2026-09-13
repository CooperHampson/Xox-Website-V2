import { useState } from "react";
import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";
import { MerchFilter } from "../filters/MerchFilter";
import { MerchData } from "../components/MerchData";

import { defaultMerchFilters, type MerchFilters } from "../filters/MerchFilters";
import { filterMerch } from "../filters/FilterMerch";

import './CategoryPages.css';

export function PantsPage() {
  const [filters, setFilters] = useState<MerchFilters>(defaultMerchFilters);

  const pantsItems = MerchData.filter((item) => item.category === 'pants');

  const filteredItems = filterMerch(pantsItems, filters);

  return (
    <>
      <title>Xoxxly | Merch Pants</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">Pants</p>
        
        <MerchFilter filters={filters} onFiltersChange={setFilters} />

        <StoreLayout category="pants" items={filteredItems} />
      </div>
    </>
  );
}