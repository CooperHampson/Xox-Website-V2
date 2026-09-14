import { useState } from "react";
import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";
import { MerchFilter } from "../filters/MerchFilter";
import { MerchData } from "../components/MerchData";

import { defaultMerchFilters, type MerchFilters } from "../filters/MerchFilters";
import { filterMerch } from "../filters/FilterMerch";

import './CategoryPages.css';

export function DailyLifePage() {
  const [filters, setFilters] = useState<MerchFilters>(defaultMerchFilters);

  const dailyLifeItems = MerchData.filter((item) => item.category === 'daily life');

  const filteredItems = filterMerch(dailyLifeItems, filters);
  return (
    <>
      <title>Xoxxly | Merch Daily Life</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">Daily Life</p>
        
        <MerchFilter filters={filters} onFiltersChange={setFilters} />

        <StoreLayout category="daily life" items={filteredItems} />
      </div>
    </>
  );
}