import test from 'node:test';
import assert from 'node:assert/strict';

function calculateAdoptedImpact(swaps) {
  const adopted = swaps.filter(s => s.adopted);
  const dailyCo2 = adopted.reduce((sum, s) => sum + s.co2SavedKgPerDay, 0);
  const monthlyCo2 = dailyCo2 * 30;
  const yearlyCo2 = dailyCo2 * 365;

  const avgPm25 = adopted.length > 0 
    ? Math.round(adopted.reduce((sum, s) => sum + s.pm25ReductionPercent, 0) / adopted.length)
    : 0;

  const treesEquivalent = Math.round((yearlyCo2 / 21.77) * 10) / 10;
  const cleanAirHoursGained = Math.round(adopted.length * 2.8 * 30);

  return {
    dailyCo2SavedKg: Math.round(dailyCo2 * 10) / 10,
    monthlyCo2SavedKg: Math.round(monthlyCo2 * 10) / 10,
    yearlyCo2SavedKg: Math.round(yearlyCo2 * 10) / 10,
    avgPm25ReductionPercent: avgPm25,
    treesEquivalent,
    cleanAirHoursGained
  };
}

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
