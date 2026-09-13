export interface MerchFilters {
  categories: string[];

  minPrice: number | null;
  maxPrice: number | null;

  colours: string[];
  tags: string[];
  materials: string[];
}

export const defaultMerchFilters: MerchFilters = {
  categories: [],

  minPrice: null,
  maxPrice: null,

  colours: [],
  tags: [],
  materials: [],
};