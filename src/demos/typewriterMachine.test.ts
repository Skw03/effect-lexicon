import { expect, it } from 'vitest';
import { advanceType, initialTypeState, phrases } from './typewriterMachine';
import { pointerPath } from '../hooks/useVirtualPointer';
it('non-loop visits every full phrase, deletes between phrases, retains third', () => {
  let state = initialTypeState;
  const seen: number[] = [];
  let deletes = 0;
  for (let step = 0; step < 200 && state.phase !== 'done'; step++) {
    state = advanceType(state, false);
    if (state.phase === 'holding') seen.push(state.phrase);
    if (state.phase === 'deleting') deletes++;
  }
  expect(seen).toEqual([0, 1, 2]);
  expect(deletes).toBeGreaterThan(0);
  expect(state).toEqual({ phrase: 2, count: Array.from(phrases[2]).length, phase: 'done' });
  expect(advanceType(state, false)).toEqual(state);
});
it('normal looping returns to first after deleting the third', () => {
  let state = initialTypeState;
  const seen: number[] = [];
  for (let step = 0; step < 200 && seen.length < 4; step++) {
    state = advanceType(state, true);
    expect(state.phase).not.toBe('done');
    if (state.phase === 'holding') seen.push(state.phrase);
  }
  expect(seen).toEqual([0, 1, 2, 0]);
});
it('virtual pointer stays bounded and finite, with rest endpoints', () => {
  expect(pointerPath(0)).toEqual({ x: .5, y: .5 });
  expect(pointerPath(1)).toEqual({ x: .5, y: .5 });
  for (let i = 0; i <= 100; i++) for (const value of Object.values(pointerPath(i / 100))) { expect(value).toBeGreaterThanOrEqual(0.1); expect(value).toBeLessThanOrEqual(0.9); }
});
