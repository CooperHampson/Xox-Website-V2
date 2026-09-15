import type { MerchItem } from "../components/MerchData";

export function getUniqueCategories( items: MerchItem[]): string[] {
  return [
    ...new Set(
      items.map((item) => item.category)
    )
  ].sort();
}

export function getUniqueColours( items: MerchItem[]): string[] {
  return [
    ...new Set(
      items.flatMap((item) => item.colours ?? [])
    )
  ].sort();
}

export function getUniqueTags( items: MerchItem[]): string[] {
  return [
    ...new Set(
      items.flatMap((item) => item.tags ?? [])
    )
  ].sort();
}

export function getUniqueMaterials( items: MerchItem[]): string[] {
  return [
    ...new Set(
      items.flatMap((item) => item.materials ?? [])
    )
  ].sort();
}