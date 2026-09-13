import { useState } from "react";
import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";
import { MerchFilter } from "../filters/MerchFilter";
import { MerchData } from "../components/MerchData";

import { defaultMerchFilters, type MerchFilters } from "../filters/MerchFilters";
import { filterMerch } from "../filters/FilterMerch";
import './CategoryPages.css';

export function GamingPeripheralsPage() {
  const [filters, setFilters] = useState<MerchFilters>(defaultMerchFilters);

  const gamingperipheralsItems = MerchData.filter((item) => item.category === 'gaming-peripherals');

  const filteredItems = filterMerch(gamingperipheralsItems, filters);
  return (
    <>
      <title>Xoxxly | Merch Gaming Perhipherals</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">Gaming Peripherals</p>
        
        <MerchFilter filters={filters} onFiltersChange={setFilters} />

        <StoreLayout category="gaming-peripherals" items={filteredItems} />
      </div>
    </>
  );
}