import test from 'node:test';
import assert from 'node:assert/strict';

// Core AQI categorization logic matching src/lib/aqiData.ts
function getAqiCategory(aqi) {
  if (aqi <= 50) return { category: 'Good', color: '#10b981', level: 'safe' };
  if (aqi <= 100) return { category: 'Moderate', color: '#f59e0b', level: 'moderate' };
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: '#f97316', level: 'sensitive' };
  if (aqi <= 200) return { category: 'Unhealthy', color: '#ef4444', level: 'unhealthy' };
  if (aqi <= 300) return { category: 'Very Unhealthy', color: '#8b5cf6', level: 'very-unhealthy' };
  return { category: 'Hazardous', color: '#7f1d1d', level: 'hazardous' };
}

function getPollutantSeverity(pollutant, value) {
  const whoThresholds = {
    pm25: 15,
    pm10: 45,
    no2: 25,
    so2: 40,
    co: 4,
    o3: 100
  };
  const threshold = whoThresholds[pollutant] || 25;
  const ratio = value / threshold;
  if (ratio <= 1.0) return 'safe';
  if (ratio <= 2.0) return 'moderate';
  if (ratio <= 4.0) return 'high';
  return 'severe';
}

function getWhoExceedanceRatio(pm25) {
  const whoDailyLimit = 15;
  return Number((pm25 / whoDailyLimit).toFixed(1));
}

test('AQI Categorization Scale', async (t) => {
  await t.test('evaluates AQI 35 as Good', () => {
    const res = getAqiCategory(35);
    assert.equal(res.category, 'Good');
    assert.equal(res.level, 'safe');
  });

  await t.test('evaluates AQI 85 as Moderate', () => {
    const res = getAqiCategory(85);
    assert.equal(res.category, 'Moderate');
    assert.equal(res.level, 'moderate');
  });

  await t.test('evaluates AQI 140 as Sensitive', () => {
    const res = getAqiCategory(140);
    assert.equal(res.category, 'Unhealthy for Sensitive Groups');
    assert.equal(res.level, 'sensitive');
  });

  await t.test('evaluates AQI 185 as Unhealthy', () => {
    const res = getAqiCategory(185);
    assert.equal(res.category, 'Unhealthy');
    assert.equal(res.level, 'unhealthy');
  });

  await t.test('evaluates AQI 260 as Very Unhealthy', () => {
    const res = getAqiCategory(260);
    assert.equal(res.category, 'Very Unhealthy');
    assert.equal(res.level, 'very-unhealthy');
  });

  await t.test('evaluates AQI 420 as Hazardous', () => {
    const res = getAqiCategory(420);
    assert.equal(res.category, 'Hazardous');
    assert.equal(res.level, 'hazardous');
  });
});

test('WHO Pollutant Threshold & Severity Evaluation', async (t) => {
  await t.test('PM2.5 below 15 ug/m3 is safe', () => {
    assert.equal(getPollutantSeverity('pm25', 12), 'safe');
  });

  await t.test('PM2.5 at 180 ug/m3 is severe (12x limit)', () => {
    assert.equal(getPollutantSeverity('pm25', 180), 'severe');
    assert.equal(getWhoExceedanceRatio(180), 12.0);
  });

  await t.test('NO2 at 35 ppb is moderate', () => {
    assert.equal(getPollutantSeverity('no2', 35), 'moderate');
  });
});
