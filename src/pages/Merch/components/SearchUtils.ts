import type { MerchItem } from "./MerchData";

type SearchField = {
  value: string;
  weight: number;
};

function normaliseText(text: string): string {
  return text.toLowerCase().trim().replace(/[^\p{L}\p{N}\s]/gu, '');
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function getSimilarity(a: string, b:string): number {
  if (!a || !b) {
    return 0;
  }

  if (a === b) {
    return 1;
  }

  if (a.includes(b)) {
    return 0.9;
  }

  if (b.includes(a)) {
    return 0.8;
  }

  const distance = levenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);

  if (maxLength === 0) {
    return 1;
  }

  return Math.max(0, 1 - distance / maxLength);
}

function scoreField(queryWords: string[], field: SearchField): number {
  const fieldText = normaliseText(field.value);

  if (!fieldText) {
    return 0;
  }

  const fieldWords = fieldText.split(/\s+/);

  let totalScore = 0;

  for (const queryWord of queryWords) {
    let bestWordScore = 0;

    for (const fieldWord of fieldWords) {
      const similarity = getSimilarity(queryWord, fieldWord);

      if (similarity > bestWordScore) {
        bestWordScore = similarity;
      }
    }

    //Check entire field for phrases
    if (fieldText.includes(queryWord)) {
      bestWordScore = Math.max(bestWordScore, 0.95);
    }

    totalScore += bestWordScore;
  }

  return totalScore * field.weight;
}

function getSearchFields(item: MerchItem): SearchField[] {
  return [
    {
      value: item.name,
      weight: 5,
    },
    {
      value: item.category,
      weight: 3
    },
    {
      value: item.description,
      weight: 2
    }
  ];
}

export function searchMerch(items: MerchItem[], query: string): MerchItem[] {
  const normalisedQuery = normaliseText(query);

  if (!normalisedQuery) {
    return [];
  }

  const queryWords = normalisedQuery.split(/\s+/);

  const results = items.map((item) => {
    const fields = getSearchFields(item);

    const score = fields.reduce((total, field) => {
      return total + scoreField(queryWords, field);
    }, 0);

    return {
      item,
      score,
    };
  }).filter((result) => result.score > 0).sort((a, b) => b.score - a.score);

  return results.map((result) => result.item);
}