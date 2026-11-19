import { normalize } from './normalize';
// Exact character substrings, not fuzzy one-character matches: punctuation is
// a boundary and each repeated gram contributes only once.
export function chineseGrams(text: string): string[] {
  const grams = new Set<string>();
  for (const run of normalize(text).match(/\p{Script=Han}+/gu) ?? []) {
    const chars = Array.from(run);
    for (const size of [2, 3]) for (let i = 0; i + size <= chars.length; i++) grams.add(chars.slice(i, i + size).join(''));
  }
  return [...grams];
}
export function chineseCoverage(query: string, documents: string[][]) {
  const grams = chineseGrams(query);
  const indexed = documents.map(entries => entries.map(normalize));
  // Document frequency discounts ubiquitous trigger/object words. A rare
  // visible action/shape carries more evidence than another mention of mouse.
  const weighted = grams.map(gram => ({ gram, weight: 1 + Math.log((documents.length + 1) / (1 + indexed.filter(entries => entries.some(text => text.includes(gram))).length)) }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  return (text: string) => {
    const normalized = normalize(text);
    return total ? weighted.reduce((sum, item) => sum + (normalized.includes(item.gram) ? item.weight : 0), 0) / total : 0;
  };
}
