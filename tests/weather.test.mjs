import test from 'node:test';
import assert from 'node:assert/strict';

function degreesToCompass(deg) {
  if (deg === undefined || deg === null) return 'Calm';
  const val = Math.floor((deg / 22.5) + 0.5);
  const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return arr[(val % 16)];
}

function assessInversionRisk(temp, windSpeed, pressure, hour) {
  let score = 0;
  if (windSpeed < 5.0) score += 40;
  else if (windSpeed < 10.0) score += 20;

  if (temp < 15.0) score += 30;
  else if (temp < 20.0) score += 15;

  if (pressure > 1013.0) score += 20;

  if (hour >= 20 || hour <= 8) score += 20;

  if (score >= 70) return 'Severe';
  if (score >= 45) return 'High';
  if (score >= 25) return 'Moderate';
  return 'Low';
}

test('Meteorological & Inversion Calculations', async (t) => {
  await t.test('converts wind azimuth degrees to compass directions', () => {
    assert.equal(degreesToCompass(0), 'N');
    assert.equal(degreesToCompass(90), 'E');
    assert.equal(degreesToCompass(180), 'S');
    assert.equal(degreesToCompass(270), 'W');
    assert.equal(degreesToCompass(45), 'NE');
    assert.equal(degreesToCompass(null), 'Calm');
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
});
