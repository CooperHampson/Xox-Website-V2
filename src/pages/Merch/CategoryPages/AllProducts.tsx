import { useState } from "react";
import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";
import { MerchFilter } from "../filters/MerchFilter";
import { MerchData } from "../components/MerchData";

import { defaultMerchFilters, type MerchFilters } from "../filters/MerchFilters";
import { filterMerch } from "../filters/FilterMerch";

import { useCurrency } from "../currency/CurrencyContext";

import './CategoryPages.css';

export function AllProducts() {
  const [filters, setFilters] = useState<MerchFilters>(defaultMerchFilters);

  const { currentCurrency } = useCurrency();

  const filteredItems = filterMerch(MerchData, filters, currentCurrency.code);

  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`
  };

  return (
    <>
      <title>Xoxxly | Merch All Products</title>

      <div className="background-container" style={bgImageUrl}>

        <MerchHeader />

        <div className="category-container">
          <p className="category-title">All Products</p>

          <MerchFilter items={MerchData} filters={filters} onFiltersChange={setFilters} showCategories={true} />

          <StoreLayout items={filteredItems} />
        </div>

      </div>
    </>
  );
}