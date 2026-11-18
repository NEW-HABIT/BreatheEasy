import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAdoptedImpact, INITIAL_SUSTAINABLE_SWAPS } from '../src/lib/impactCalculator.ts';

const mockSwaps = [
  { id: '1', title: 'Metro Commute', co2SavedKgPerDay: 4.8, pm25ReductionPercent: 65, adopted: true },
  { id: '2', title: 'Induction Cooking', co2SavedKgPerDay: 0.9, pm25ReductionPercent: 45, adopted: true },
  { id: '3', title: 'Box Fan Purifier', co2SavedKgPerDay: 0.2, pm25ReductionPercent: 80, adopted: false }
];

test('Quantified Impact Engine Calculations', async (t) => {
  await t.test('calculates correct daily CO2 savings for adopted swaps', () => {
    const res = calculateAdoptedImpact(mockSwaps);
    // 4.8 + 0.9 = 5.7 kg
    assert.equal(res.dailyCo2SavedKg, 5.7);
  });

  await t.test('computes monthly and yearly CO2 metrics', () => {
    const res = calculateAdoptedImpact(mockSwaps);
    // monthly: 5.7 * 30 = 171 kg
    assert.equal(res.monthlyCo2SavedKg, 171);
    // yearly: 5.7 * 365 = 2080.5 kg
    assert.equal(res.yearlyCo2SavedKg, 2080.5);
  });

  await t.test('calculates tree absorption equivalents', () => {
    const res = calculateAdoptedImpact(mockSwaps);
    // 2080.5 / 21.77 = ~95.6 trees
    assert.ok(res.treesEquivalent > 90);
  });

  await t.test('computes average PM2.5 reduction across adopted habits', () => {
    const res = calculateAdoptedImpact(mockSwaps);
    // (65 + 45) / 2 = 55%
    assert.equal(res.avgPm25ReductionPercent, 55);
  });

  await t.test('returns zero metrics when no swaps are active', () => {
    const unadopted = mockSwaps.map(s => ({ ...s, adopted: false }));
    const res = calculateAdoptedImpact(unadopted);
    assert.equal(res.dailyCo2SavedKg, 0);
    assert.equal(res.avgPm25ReductionPercent, 0);
    assert.equal(res.treesEquivalent, 0);
  });
});
