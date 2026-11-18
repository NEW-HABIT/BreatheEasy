import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  getAqiCategory, 
  getPollutantSeverity, 
  getWhoExceedanceRatio,
  AQI_LEVELS,
  CITIES_DATA 
} from '../src/lib/aqiData.ts';

test('AQI Categorization Scale', async (t) => {
  await t.test('evaluates AQI 35 as Good', () => {
    const res = getAqiCategory(35);
    assert.equal(res.category, 'Good');
    assert.equal(res.color, AQI_LEVELS.good.color);
  });

  await t.test('evaluates AQI 85 as Moderate', () => {
    const res = getAqiCategory(85);
    assert.equal(res.category, 'Moderate');
    assert.equal(res.color, AQI_LEVELS.moderate.color);
  });

  await t.test('evaluates AQI 140 as Sensitive', () => {
    const res = getAqiCategory(140);
    assert.equal(res.category, 'Unhealthy for Sensitive Groups');
    assert.equal(res.color, AQI_LEVELS.sensitive.color);
  });

  await t.test('evaluates AQI 185 as Unhealthy', () => {
    const res = getAqiCategory(185);
    assert.equal(res.category, 'Unhealthy');
    assert.equal(res.color, AQI_LEVELS.unhealthy.color);
  });

  await t.test('evaluates AQI 260 as Very Unhealthy', () => {
    const res = getAqiCategory(260);
    assert.equal(res.category, 'Very Unhealthy');
    assert.equal(res.color, AQI_LEVELS.veryUnhealthy.color);
  });

  await t.test('evaluates AQI 420 as Hazardous', () => {
    const res = getAqiCategory(420);
    assert.equal(res.category, 'Hazardous');
    assert.equal(res.color, AQI_LEVELS.hazardous.color);
  });

  await t.test('handles boundary edge cases gracefully', () => {
    assert.equal(getAqiCategory(50).category, 'Good');
    assert.equal(getAqiCategory(51).category, 'Moderate');
    assert.equal(getAqiCategory(100).category, 'Moderate');
    assert.equal(getAqiCategory(101).category, 'Unhealthy for Sensitive Groups');
    assert.equal(getAqiCategory(150).category, 'Unhealthy for Sensitive Groups');
    assert.equal(getAqiCategory(151).category, 'Unhealthy');
    assert.equal(getAqiCategory(200).category, 'Unhealthy');
    assert.equal(getAqiCategory(201).category, 'Very Unhealthy');
    assert.equal(getAqiCategory(300).category, 'Very Unhealthy');
    assert.equal(getAqiCategory(301).category, 'Hazardous');
    assert.equal(getAqiCategory(-5).category, 'Good');
    assert.equal(getAqiCategory(NaN).category, 'Unhealthy for Sensitive Groups');
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

  await t.test('SO2 and CO thresholds evaluate correctly', () => {
    assert.equal(getPollutantSeverity('so2', 20), 'safe');
    assert.equal(getPollutantSeverity('so2', 90), 'high');
    assert.equal(getPollutantSeverity('co', 3), 'safe');
    assert.equal(getPollutantSeverity('o3', 120), 'moderate');
  });

  await t.test('verifies pre-configured cities dataset has New Delhi severe winter data', () => {
    assert.ok(CITIES_DATA['New Delhi']);
    assert.equal(CITIES_DATA['New Delhi'].city, 'New Delhi');
    assert.ok(CITIES_DATA['New Delhi'].aqi >= 300);
    assert.equal(CITIES_DATA['New Delhi'].primaryPollutant, 'PM2.5');
  });
});
