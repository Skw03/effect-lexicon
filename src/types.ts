export type Category = 'buttons' | 'cards' | 'text' | 'backgrounds' | 'navigation' | 'scrolling' | 'loading' | 'transitions';
export type Trigger = 'hover' | 'pointer-follow' | 'click' | 'scroll' | 'page-load' | 'continuous' | 'none';
export type EffectType = 'animation' | 'interaction' | 'style';

export interface Param {
  key: string;
  label: string; // Chinese label
  kind: 'number' | 'boolean' | 'select';
  default: number | boolean | string;
  min?: number; max?: number; step?: number; unit?: string;
  options?: { value: string; label: string }[];
}

export interface Effect {
  id: string;
  slug: string;
  status: 'published' | 'draft';
  name: { en: string; zh: string };
  aliases: { en: string[]; zh: string[] };
  searchPhrases: { en: string[]; zh: string[] };
  category: Category;
  type: EffectType;
  triggers: Trigger[];
  tags: string[];
  summary: string; // Chinese, one line
  whatYouSee: string; // Chinese, 2 to 3 sentences
  behavior: string[]; // Chinese, ordered steps
  useCases: string[]; // Chinese
  terminologyNote?: string; // Chinese
  related: string[]; // slugs
  demo: { component: string; hint: string; hintTouch: string; replayable: boolean; autoDemo: boolean; staticStyle?: boolean };
  params: Param[];
  prompt: { en: string; zh: string };
}

export type Values = Record<string, number | boolean | string>;
export type Language = 'en' | 'zh';
export interface PointerPosition { x: number; y: number }
export interface DemoProps {
  values: Values;
  running: boolean;
  replayKey: number;
  virtualPointer?: PointerPosition;
  reducedMotion: boolean;
  onComplete: () => void;
}
export function defaults(effect: Effect): Values {
  return Object.fromEntries(effect.params.map(param => [param.key, param.default]));
}
