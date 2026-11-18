import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFamilyRisk } from '../src/lib/aqiData.mjs';

test('Family Member Health Risk Categorization', async (t) => {
  await t.test('6-year-old child with asthma in severe smog (AQI 320) is Severe', () => {
    const child = { id: 'fam-child', name: 'Arya', role: 'Child', age: 6, healthConditions: ['Asthma'] };
    const res = calculateFamilyRisk(child, 320);
    assert.equal(res.riskLevel, 'Severe');
    assert.equal(res.hasAlert, true);
    assert.ok(res.advice.length >= 2);
  });

  await t.test('68-year-old elder with hypertension in high smog (AQI 180) is High', () => {
    const elder = { id: 'fam-elder', name: 'Sushila', role: 'Elderly', age: 68, healthConditions: ['Hypertension'] };
    const res = calculateFamilyRisk(elder, 180);
    assert.equal(res.riskLevel, 'High');
    assert.equal(res.hasAlert, true);
  });

  await t.test('35-year-old healthy adult in moderate air (AQI 90) is Low', () => {
    const adult = { id: 'fam-adult', name: 'Rajesh', role: 'Self', age: 35, healthConditions: [] };
    const res = calculateFamilyRisk(adult, 90);
    assert.equal(res.riskLevel, 'Low');
    assert.equal(res.hasAlert, false);
  });

  await t.test('30-year-old healthy adult in severe smog (AQI 280) is High', () => {
    const adult = { id: 'fam-adult-2', name: 'Vikram', role: 'Self', age: 30, healthConditions: [] };
    const res = calculateFamilyRisk(adult, 280);
    assert.equal(res.riskLevel, 'High');
    assert.equal(res.hasAlert, true);
    assert.ok(res.advice.some(a => a.includes('N95')));
  });

  await t.test('30-year-old healthy adult in unhealthy smog (AQI 170) is Moderate', () => {
    const adult = { id: 'fam-adult-3', name: 'Vikram', role: 'Self', age: 30, healthConditions: [] };
    const res = calculateFamilyRisk(adult, 170);
    assert.equal(res.riskLevel, 'Moderate');
    assert.equal(res.hasAlert, false);
  });

  await t.test('handles string-based health conditions properly', () => {
    const stringConditionMember = {
      id: 'fam-str',
      name: 'Priya',
      role: 'Spouse',
      age: 34,
      healthConditions: 'Wheezing, seasonal allergies'
    };
    const res = calculateFamilyRisk(stringConditionMember, 280);
    assert.equal(res.riskLevel, 'Severe');
    assert.equal(res.hasAlert, true);
  });

  await t.test('handles moderate smog for vulnerable vs non-vulnerable adults', () => {
    const vulnerable = { id: 'v1', name: 'Elder', role: 'Elderly', age: 72, healthConditions: [] };
    const healthy = { id: 'h1', name: 'Adult', role: 'Self', age: 28, healthConditions: [] };
    
    const vRes = calculateFamilyRisk(vulnerable, 120);
    const hRes = calculateFamilyRisk(healthy, 120);
    
    assert.equal(vRes.riskLevel, 'Moderate');
    assert.equal(hRes.riskLevel, 'Low');
  });

  await t.test('optimal clean air evaluates as Low risk with celebratory advice', () => {
    const member = { id: 'clean', name: 'Child', role: 'Child', age: 8, healthConditions: ['Asthma'] };
    const res = calculateFamilyRisk(member, 40);
    assert.equal(res.riskLevel, 'Low');
    assert.equal(res.hasAlert, false);
    assert.ok(res.advice[0].includes('optimal'));
  });
});
