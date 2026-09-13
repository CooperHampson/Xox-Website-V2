import { useState } from "react";
import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";
import { MerchFilter } from "../filters/MerchFilter";
import { MerchData } from "../components/MerchData";

import { defaultMerchFilters, type MerchFilters } from "../filters/MerchFilters";
import { filterMerch } from "../filters/FilterMerch";

import './CategoryPages.css';

export function AllProducts() {
  const [filters, setFilters] = useState<MerchFilters>(defaultMerchFilters);

  const filteredItems = filterMerch(MerchData, filters);

  return (
    <>
      <title>Xoxxly | Merch All Products</title>

      <MerchHeader />
      
      <div className="category-container">
        <p className="category-title">All Products</p>

        <MerchFilter filters={filters} onFiltersChange={setFilters} />
        
        <StoreLayout items={filteredItems}/>
      </div>
    </>
  );
}