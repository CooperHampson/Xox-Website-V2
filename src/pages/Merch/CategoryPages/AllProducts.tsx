import { useEffect, useState } from "react";
import { MerchHeader } from "../components/MerchHeader";
import { StoreLayout } from "../components/StoreLayout";
import { MerchFilter } from "../filters/MerchFilter";
import type { MerchItem } from "../../../types/merch";
import { defaultMerchFilters, type MerchFilters } from "../filters/MerchFilters";
import { filterMerch } from "../filters/FilterMerch";

import { useCurrency } from "../currency/CurrencyContext";
import { getMerch } from "../../../api/merchApi";

import './CategoryPages.css';

export function AllProducts() {
  const [filters, setFilters] = useState<MerchFilters>(defaultMerchFilters);
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const { currentCurrency } = useCurrency();

  useEffect(() => {
    async function loadMerch() {
      try {
        const items = await getMerch();

        setMerchItems(items);
      } catch (error) {
        console.error('Failed to load merch:', error);
      }
    }

    loadMerch();
  }, []);

  const filteredItems = filterMerch(merchItems, filters, currentCurrency.code);

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

          <MerchFilter items={merchItems} filters={filters} onFiltersChange={setFilters} showCategories={true} />

          <StoreLayout items={filteredItems} />
        </div>

      </div>
    </>
  );
}