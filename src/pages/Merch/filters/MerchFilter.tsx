import type { MerchFilters } from './MerchFilters';
import { getUniqueCategories, getUniqueColours, getUniqueTags, getUniqueMaterials } from './FilterOptions';
import './MerchFilter.css';

interface MerchFilterProps {
  filters: MerchFilters;
  onFiltersChange: (filters: MerchFilters) => void;
}

export function MerchFilter({ filters, onFiltersChange }: MerchFilterProps) {

  const categories = getUniqueCategories();

  const colours = getUniqueColours();

  const tags = getUniqueTags();

  const materials = getUniqueMaterials();

  const toggleFilter = (
    filterType:
      | 'categories'
      | 'colours'
      | 'tags'
      | 'materials',

    value: string
  ) => {
    const currentValues = filters[filterType];

    const updatedValues = currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value];

    onFiltersChange({ ...filters, [filterType]: updatedValues });
  };

  return (
    <aside className="merch-filter">
      <h2 className="merch-filter-title">Filters</h2>

      {categories.length > 0 && (
        <div className="merch-filter-selection">
          <h3 className="merch-filter-section-title">Categories</h3>

          {categories.map((category) => (
            <label key={category} className="merch-filter-option">
              <input type="checkbox" checked={filters.categories.includes(category)} onChange={() => toggleFilter('categories', category)} />

              <span>{category}</span>
            </label>
          ))}
        </div>
      )}

      {colours.length > 0 && (
        <div className="merch-filter-selection">
          <h3 className="merch-filter-section-title">Colours</h3>

          {colours.map((colour) => (
            <label key={colour} className="merch-filter-option" >
              <input type="checkbox" checked={filters.colours.includes(colour)} onChange={() => toggleFilter('colours', colour)} />

              <span> {colour} </span>
            </label>
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <div className="merch-filter-section">
          <h3 className="merch-filter-section-title"> Tags </h3>

          {tags.map((tag) => (
            <label key={tag} className="merch-filter-option" >
              <input type="checkbox" checked={filters.tags.includes(tag)} onChange={() => toggleFilter('tags', tag)} />
              <span> {tag} </span>
            </label>
          ))}
        </div>
      )}

      {materials.length > 0 && (
        <div className="merch-filter-section">
          <h3 className="merch-filter-section-title"> Materials </h3>
          {materials.map((material) => (<label key={material} className="merch-filter-option" >
            <input type="checkbox" checked={filters.materials.includes(material)} onChange={() => toggleFilter('materials', material)} />
            <span> {material} </span>
          </label>
          ))}
        </div>
      )}

      <div className="merch-filter-section">
        <h3 className="merch-filter-section-title"> Price </h3>
        <div className="merch-price-inputs"> <input type="number" placeholder="Min price" value={filters.minPrice === null ? '' : filters.minPrice / 100} onChange={(event) => { const value = event.target.value; onFiltersChange({ ...filters, minPrice: value === '' ? null : Number(value) * 100 }); }} />
          <input type="number" placeholder="Max price" value={filters.maxPrice === null ? '' : filters.maxPrice / 100} onChange={(event) => { const value = event.target.value; onFiltersChange({ ...filters, maxPrice: value === '' ? null : Number(value) * 100 }); }} />
        </div>
      </div>

      <button type="button" className="clear-filters-button" onClick={() => onFiltersChange({ categories: [], colours: [], tags: [], materials: [], minPrice: null, maxPrice: null, }) } > Clear Filters </button>
    </aside >
  );
}