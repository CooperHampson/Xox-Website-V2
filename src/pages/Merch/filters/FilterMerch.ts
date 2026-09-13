import type { MerchItem } from '../components/MerchData';
import type { MerchFilters } from './MerchFilters';

export function filterMerch(
  items: MerchItem[],
  filters: MerchFilters
): MerchItem[] {

  return items.filter((item) => {


    // CATEGORY FILTER

    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(item.category);


    // PRICE FILTER

    const itemPrice = Number(item.price);

    const matchesMinPrice =
      filters.minPrice === null ||
      itemPrice >= filters.minPrice;

    const matchesMaxPrice =
      filters.maxPrice === null ||
      itemPrice <= filters.maxPrice;


    // COLOUR FILTER

    const matchesColour =
      filters.colours.length === 0 ||
      item.colours?.some((colour) =>
        filters.colours.includes(colour)
      );


    // TAG FILTER

    const matchesTags =
      filters.tags.length === 0 ||
      item.tags?.some((tag) =>
        filters.tags.includes(tag)
      );


    // MATERIAL FILTER

    const matchesMaterials =
      filters.materials.length === 0 ||
      item.materials?.some((material) =>
        filters.materials.includes(material)
      );


    return (
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesColour &&
      matchesTags &&
      matchesMaterials
    );


  });

}
