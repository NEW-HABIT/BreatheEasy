import test from 'node:test';
import assert from 'node:assert/strict';
import { degreesToCompass, assessInversionRisk } from '../src/lib/iaqEngineering.ts';

test('Meteorological & Inversion Calculations', async (t) => {
  await t.test('converts wind azimuth degrees to compass directions', () => {
    assert.equal(degreesToCompass(0), 'N');
    assert.equal(degreesToCompass(90), 'E');
    assert.equal(degreesToCompass(180), 'S');
    assert.equal(degreesToCompass(270), 'W');
    assert.equal(degreesToCompass(45), 'NE');
    assert.equal(degreesToCompass(null), 'Calm');
    assert.equal(degreesToCompass(undefined), 'Calm');
  });

  await t.test('detects severe thermal inversion risk during winter night stagnation', () => {
    // Cold (10°C), calm wind (2 km/h), high pressure (1018 hPa), nighttime (2 AM)
    const risk = assessInversionRisk(10.0, 2.0, 1018.0, 2);
    assert.equal(risk, 'Severe');
  });

  await t.test('detects low inversion risk on windy sunny afternoon', () => {
    // Warm (28°C), strong breeze (18 km/h), normal pressure (1008 hPa), afternoon (2 PM)
    const risk = assessInversionRisk(28.0, 18.0, 1008.0, 14);
    assert.equal(risk, 'Low');
  });

  await t.test('detects moderate inversion risk for intermediate weather conditions', () => {
    const risk = assessInversionRisk(18.0, 8.0, 1014.0, 15);
    assert.ok(risk === 'Moderate' || risk === 'High');
  });
});
