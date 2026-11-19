import Fuse from 'fuse.js';
import type { Effect } from '../types';
import { normalize } from './normalize';
import { queryTerms } from './synonyms';
import { chineseCoverage, chineseGrams } from './chinese';
export interface SearchHit { effect: Effect; score: number; matchedField: string; matchedText: string }
const weights = { 'name.en': 5, 'name.zh': 5, aliases: 4, searchPhrases: 3.5, tags: 2, summary: 1, whatYouSee: 1, useCases: 1 };
function fields(effect: Effect) {
  return [
    ...Object.entries(effect.name).map(([lang, text]) => ({ field: `name.${lang}`, text })),
    ...[...effect.aliases.en, ...effect.aliases.zh].map(text => ({ field: 'aliases', text })),
    ...[...effect.searchPhrases.en, ...effect.searchPhrases.zh].map(text => ({ field: 'searchPhrases', text })),
    ...effect.tags.map(text => ({ field: 'tags', text })),
    { field: 'summary', text: effect.summary }, { field: 'whatYouSee', text: effect.whatYouSee },
    ...effect.useCases.map(text => ({ field: 'useCases', text })),
  ];
}
function document(effect: Effect) {
  return { effect, name: { en: normalize(effect.name.en), zh: normalize(effect.name.zh) }, aliases: [...effect.aliases.en, ...effect.aliases.zh].map(normalize), searchPhrases: [...effect.searchPhrases.en, ...effect.searchPhrases.zh].map(normalize), tags: effect.tags.map(normalize), summary: normalize(effect.summary), whatYouSee: normalize(effect.whatYouSee), useCases: effect.useCases.map(normalize) };
}
const isName = (field: string) => field.startsWith('name.') || field === 'aliases';
const containsTerm = (text: string, term: string) => /\p{Script=Han}/u.test(term) ? text.includes(term) : text.split(' ').some(word => word.startsWith(term));
export function searchEffects(effects: Effect[], query: string, threshold = 0.35): SearchHit[] {
  const q = normalize(query);
  if (!q) return effects.map(effect => ({ effect, score: 0, matchedField: '', matchedText: '' }));
  const terms = queryTerms(q);
  const grams = chineseGrams(q);
  const coverage = chineseCoverage(q, effects.map(effect => fields(effect).map(entry => entry.text)));
  const fuse = new Fuse(effects.map(document), { keys: Object.entries(weights).map(([name, weight]) => ({ name, weight })), ignoreLocation: true, threshold, minMatchCharLength: 1, includeMatches: true, includeScore: true });
  const fuzzy = new Map<string, { score: number; field: string; text: string }>();
  for (const term of new Set([q, ...terms.flat()])) {
    for (const hit of fuse.search(term)) {
      const match = hit.matches?.[0];
      const old = fuzzy.get(hit.item.effect.id);
      if (!old || (hit.score ?? 1) < old.score) fuzzy.set(hit.item.effect.id, { score: hit.score ?? 1, field: match?.key ?? '', text: match?.value ?? '' });
    }
  }
  return effects.flatMap(effect => {
    const entries = fields(effect);
    const exact = entries.find(entry => isName(entry.field) && normalize(entry.text) === q);
    const prefix = entries.find(entry => isName(entry.field) && normalize(entry.text).startsWith(q));
    const phrase = entries.find(entry => entry.field === 'searchPhrases' && normalize(entry.text).includes(q));
    const matches = entries.map(entry => ({ ...entry, coverage: (grams.length ? 0.35 : 1) * terms.filter(group => group.some(term => containsTerm(normalize(entry.text), term))).length / terms.length + 0.65 * coverage(entry.text) }));
    matches.sort((a, b) => b.coverage - a.coverage || (weights[b.field as keyof typeof weights] - weights[a.field as keyof typeof weights]));
    const best = matches[0];
    const loose = fuzzy.get(effect.id);
    if (!exact && !prefix && !phrase && !loose && !best.coverage) return [];
    const selected = exact ?? prefix ?? phrase ?? (best.coverage ? best : entries.find(entry => entry.field === loose?.field && normalize(entry.text) === loose.text)) ?? best;
    const score = exact ? -4 : prefix ? -3 : phrase ? -2 : -best.coverage + (loose?.score ?? 1) * 0.1;
    return [{ effect, score, matchedField: selected.field, matchedText: selected.text }];
  }).sort((a, b) => a.score - b.score);
}
// Normalized edit distance provides an honest ordering even when Fuse has no
// candidates. These are recommendations, never promoted to matched results.
function distance(left: string, right: string): number {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i++) {
    const row = [i];
    for (let j = 1; j <= right.length; j++) row[j] = Math.min(row[j - 1] + 1, previous[j] + 1, previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1));
    previous = row;
  }
  return previous[right.length] / Math.max(left.length, right.length, 1);
}
export function discover(effects: Effect[], query: string) {
  const hits = searchEffects(effects, query);
  if (hits.length || !normalize(query)) return { hits, nearest: [] as SearchHit[] };
  const ranked = searchEffects(effects, query, 0.8);
  const remainder = effects.filter(effect => !ranked.some(hit => hit.effect.id === effect.id)).map(effect => ({
    effect, score: Math.min(...fields(effect).map(entry => distance(normalize(query), normalize(entry.text)))), matchedField: '', matchedText: '',
  })).sort((a, b) => a.score - b.score);
  return { hits, nearest: [...ranked, ...remainder].slice(0, 3) };
}
