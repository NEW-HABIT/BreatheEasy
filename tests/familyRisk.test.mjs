import test from 'node:test';
import assert from 'node:assert/strict';

function getFamilyVulnerability(member, aqi) {
  const safeAqi = typeof aqi === 'number' && !isNaN(aqi) ? aqi : 150;
  const memberAge = typeof member.age === 'number' ? member.age : 30;
  const isVulnerableAge = memberAge < 12 || memberAge > 60;

  const conditions = Array.isArray(member.healthConditions)
    ? member.healthConditions
    : typeof member.healthConditions === 'string'
    ? member.healthConditions.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const hasRespiratoryIssues = conditions.some(c => 
    typeof c === 'string' && ['asthma', 'bronchitis', 'allergies', 'cardiovascular', 'copd', 'wheezing', 'hypertension', 'sensitivity'].some(term => c.toLowerCase().includes(term))
  );

  if (safeAqi > 250) {
    if (hasRespiratoryIssues || isVulnerableAge) {
      return { riskLevel: 'Severe', hasAlert: true };
    }
    return { riskLevel: 'High', hasAlert: true };
  } else if (safeAqi > 150) {
    if (hasRespiratoryIssues || isVulnerableAge) {
      return { riskLevel: 'High', hasAlert: true };
    }
    return { riskLevel: 'Moderate', hasAlert: false };
  } else if (safeAqi > 100) {
    if (hasRespiratoryIssues || isVulnerableAge) {
      return { riskLevel: 'Moderate', hasAlert: false };
    }
    return { riskLevel: 'Low', hasAlert: false };
  } else {
    return { riskLevel: 'Low', hasAlert: false };
  }
}

test('Family Member Health Risk Categorization', async (t) => {
  await t.test('6-year-old child with asthma in severe smog (AQI 320) is Severe', () => {
    const child = { name: 'Arya', role: 'Child', age: 6, healthConditions: ['Asthma'] };
    const res = getFamilyVulnerability(child, 320);
    assert.equal(res.riskLevel, 'Severe');
    assert.equal(res.hasAlert, true);
  });

  await t.test('68-year-old elder with hypertension in high smog (AQI 180) is High', () => {
    const elder = { name: 'Sushila', role: 'Elderly', age: 68, healthConditions: ['Hypertension'] };
    const res = getFamilyVulnerability(elder, 180);
    assert.equal(res.riskLevel, 'High');
  });

  await t.test('35-year-old healthy adult in moderate air (AQI 90) is Low', () => {
    const adult = { name: 'Rajesh', role: 'Self', age: 35, healthConditions: [] };
    const res = getFamilyVulnerability(adult, 90);
    assert.equal(res.riskLevel, 'Low');
    assert.equal(res.hasAlert, false);
  });

  await t.test('handles string-based health conditions properly', () => {
    const member = { name: 'Priya', role: 'Spouse', age: 34, healthConditions: 'Seasonal Wheezing, Allergies' };
    const res = getFamilyVulnerability(member, 280);
    assert.equal(res.riskLevel, 'Severe');
  });
});
