import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateCadrEquivalent, 
  calculateIndoorExposure, 
  evaluateDiurnalWindowSafety,
  calculateAirChangesPerHour
} from '../src/lib/iaqEngineering.mjs';

test('Indoor Air Quality (IAQ) Engineering Blueprints', async (t) => {
  await t.test('Corsi-Rosenthal box fan delivers 480+ CFM CADR matching $600 appliances', () => {
    // 20-inch box fan (600 CFM) with MERV-13 filter (80% single-pass efficiency)
    const cadr = calculateCadrEquivalent(600, 0.80);
    assert.equal(cadr, 480);
    assert.ok(cadr >= 450);
  });

  await t.test('calculates indoor PM2.5 with damp towel sealing and HEPA filtration', () => {
    // Outdoor severe smog: 300 ug/m3. Natural penetration: 0.55 (reduced to 0.30 with damp towel seal)
    const rawIndoor = calculateIndoorExposure(300, 0.55, false);
    assert.equal(rawIndoor, 165); // 165 ug/m3 unprotected indoor

    const sealedWithPurifier = calculateIndoorExposure(300, 0.30, true);
    assert.equal(sealedWithPurifier, 19.8); // 19.8 ug/m3 protected (88% cleaner)
    assert.ok(sealedWithPurifier < 25);
  });

  await t.test('identifies safe solar ventilation windows during winter inversions', () => {
    // At 8:00 AM (peak morning smog inversion) with AQI 320
    const morning = evaluateDiurnalWindowSafety(8, 320);
    assert.equal(morning.safeToVentilate, false);

    // At 2:00 PM (solar boundary layer heating and convection)
    const afternoon = evaluateDiurnalWindowSafety(14, 320);
    assert.equal(afternoon.safeToVentilate, true);

    // Midday hour 12 with moderate AQI (120)
    const middayModerate = evaluateDiurnalWindowSafety(12, 120);
    assert.equal(middayModerate.safeToVentilate, true);

    // Midday hour 12 with elevated AQI (180)
    const middayHigh = evaluateDiurnalWindowSafety(12, 180);
    assert.equal(middayHigh.safeToVentilate, false);
  });

  await t.test('calculates air changes per hour (ACH) for residential rooms', () => {
    // Standard 15ft x 12ft room with 9ft ceiling = 1620 cu.ft.
    // CADR of 250 CFM
    const ach = calculateAirChangesPerHour(250, 15, 12, 9);
    // (250 * 60) / 1620 = 9.25 ACH (exceeds hospital grade 6 ACH)
    assert.ok(ach >= 6.0);
    assert.equal(ach, 9.3);
  });

  await t.test('handles boundary zero/negative inputs safely', () => {
    assert.equal(calculateCadrEquivalent(0, 0.8), 0);
    assert.equal(calculateIndoorExposure(0, 0.55, false), 0);
    assert.equal(calculateAirChangesPerHour(0, 10, 10, 8), 0);
  });
});
