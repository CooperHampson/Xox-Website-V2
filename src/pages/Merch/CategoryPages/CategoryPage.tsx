import { useEffect, useState } from "react";

import { MerchHeader } from '../components/MerchHeader';
import { StoreLayout } from '../components/StoreLayout';
import { MerchFilter } from '../filters/MerchFilter';
import { MerchData } from '../components/MerchData';

import { defaultMerchFilters, type MerchFilters } from '../filters/MerchFilters';

import { filterMerch } from '../filters/FilterMerch';

import { useCurrency } from '../currency/CurrencyContext';

import './CategoryPages.css';

interface CategoryPageProps {
  category: string;
  title: string;
}

export function CategoryPage({ category, title}: CategoryPageProps) {
  const [filters, setFilters] = useState<MerchFilters>(defaultMerchFilters);

  const { currentCurrency } = useCurrency();

  const categoryItems = MerchData.filter((item) => item.category === category);

  const filteredItems = filterMerch( categoryItems, filters, currentCurrency.code);

  useEffect(() => {
    document.title = `Xoxxly | Merch ${title}`;
  }, [title]);

  return (
    <>
      <MerchHeader />

      <div className="category-container">
        <p className="category-title">
          {title}
        </p>

        <MerchFilter items={categoryItems} filters={filters} onFiltersChange={setFilters} showCategories={false} />

        <StoreLayout items={filteredItems} />
      </div>
    </>
    
  );
}