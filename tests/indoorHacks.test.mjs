import test from 'node:test';
import assert from 'node:assert/strict';

// Engineering models for indoor air quality hacks
function calculateCadrEquivalent(fanCfm, filterEfficiency) {
  return Math.round(fanCfm * filterEfficiency);
}

function calculateIndoorExposure(outdoorPm25, penetrationFactor, hasPurifier) {
  let indoorConcentration = outdoorPm25 * penetrationFactor;
  if (hasPurifier) {
    indoorConcentration *= 0.22; // 78% reduction via HEPA / MERV-13 Corsi-Rosenthal
  }
  return Math.round(indoorConcentration * 10) / 10;
}

function evaluateDiurnalWindowSafety(hour, aqi) {
  // Peak winter smog inversion hours: 6 AM - 10 AM & 7 PM - 11 PM
  const isGroundInversionPeak = (hour >= 6 && hour <= 10) || (hour >= 19 && hour <= 23);
  if (isGroundInversionPeak && aqi > 200) {
    return { safeToVentilate: false, recommendation: 'Keep windows strictly sealed' };
  }
  if (hour >= 13 && hour <= 15) {
    return { safeToVentilate: true, recommendation: 'Solar boundary layer active. Safe for 15-min cross-ventilation' };
  }
  return { safeToVentilate: aqi < 150, recommendation: 'Check local sensor before opening windows' };
}

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
  });
});
