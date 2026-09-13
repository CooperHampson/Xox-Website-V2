import { MerchData } from "../components/MerchData";

export function getUniqueCategories(): string[] {
  return [
    ...new Set(
      MerchData.map((item) => item.category)
    )
  ].sort();
}

export function getUniqueColours(): string[] {
  return [
    ...new Set(
      MerchData.flatMap((item) => item.colours ?? [])
    )
  ].sort();
}

export function getUniqueTags(): string[] {
  return [
    ...new Set(
      MerchData.flatMap((item) => item.tags ?? [])
    )
  ].sort();
}

export function getUniqueMaterials(): string[] {
  return [
    ...new Set(
      MerchData.flatMap((item) => item.materials ?? [])
    )
  ].sort();
}