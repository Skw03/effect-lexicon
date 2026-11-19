export const phrases = ['让灵感逐字出现', '把动效说清楚', '从看见到实现'];
export type Phase = 'intro' | 'typing' | 'holding' | 'deleting' | 'done';
export interface TypeState { phrase: number; count: number; phase: Phase }
export const initialTypeState: TypeState = { phrase: 0, count: 0, phase: 'intro' };
export function advanceType(state: TypeState, loop: boolean): TypeState {
  const length = Array.from(phrases[state.phrase]).length;
  switch (state.phase) {
    case 'intro': return { ...state, phase: 'typing' };
    case 'typing': return { ...state, count: state.count + 1, phase: state.count + 1 >= length ? 'holding' : 'typing' };
    case 'holding': return state.phrase === phrases.length - 1 && !loop ? { ...state, phase: 'done' } : { ...state, phase: 'deleting' };
    case 'deleting': return state.count > 1 ? { ...state, count: state.count - 1 } : { phrase: (state.phrase + 1) % phrases.length, count: 0, phase: 'typing' };
    case 'done': return state;
  }
}
