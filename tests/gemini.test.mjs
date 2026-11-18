import test from 'node:test';
import assert from 'node:assert/strict';
import { generateExpertFallbackResponse, generateAqiRoutine, askAirQualityAdvisor } from '../src/lib/gemini.ts';
import { CITIES_DATA } from '../src/lib/aqiData.ts';
import { DEFAULT_FAMILY_MEMBERS } from '../src/lib/store.ts';

const mockAqiData = CITIES_DATA['New Delhi'];

test('GenAI Expert Fallback & Routine Synthesis', async (t) => {
  await t.test('synthesizes personalized pediatric & asthma protocol', () => {
    const res = generateExpertFallbackResponse('How to protect my child with asthma?', mockAqiData, DEFAULT_FAMILY_MEMBERS);
    
    assert.ok(res.text.includes('Arya'));
    assert.ok(res.text.includes('Damp Towel Sealing Hack'));
    assert.ok(res.text.includes('PM2.5'));
    assert.ok(res.impactHighlight);
    assert.ok(res.impactHighlight.pm25DropPercent >= 50);
  });

  await t.test('synthesizes DIY Corsi-Rosenthal purifier instructions with scientific CADR metrics', () => {
    const res = generateExpertFallbackResponse('How to make a cheap DIY air purifier or Corsi Rosenthal box?', mockAqiData, DEFAULT_FAMILY_MEMBERS);
    
    assert.ok(res.text.includes('Corsi-Rosenthal'));
    assert.ok(res.text.includes('MERV-13'));
    assert.ok(res.text.includes('CADR'));
    assert.ok(res.impactHighlight);
    assert.equal(res.impactHighlight.pm25DropPercent, 75);
  });

  await t.test('synthesizes sustainable commute and vehicle recirculation protocol', () => {
    const res = generateExpertFallbackResponse('What is the safest way to travel and commute during severe smog?', mockAqiData, DEFAULT_FAMILY_MEMBERS);
    
    assert.ok(res.text.includes('recirculation') || res.text.includes('Metro'));
    assert.ok(res.impactHighlight);
    assert.ok(res.impactHighlight.co2SavedKg > 0);
  });

  await t.test('generates diurnal 24-hour low-emission routines aligned with meteorological cycles', async () => {
    const routine = await generateAqiRoutine(mockAqiData, DEFAULT_FAMILY_MEMBERS);
    
    assert.ok(routine.length >= 6);
    
    // Check morning inversion handling
    const morningItem = routine.find(r => r.time.includes('06:30'));
    assert.ok(morningItem);
    assert.ok(morningItem.description.includes('inversion'));
    
    // Check afternoon ventilation window
    const ventilationItem = routine.find(r => r.category === 'ventilation');
    assert.ok(ventilationItem);
    assert.equal(ventilationItem.airSafetyRating, 'Safe');

    // Check induction cooking
    const cookingItem = routine.find(r => r.category === 'cooking');
    assert.ok(cookingItem);
    assert.ok(cookingItem.description.includes('induction'));
  });

  await t.test('askAirQualityAdvisor invokes fallback gracefully when API key is unconfigured', async () => {
    const res = await askAirQualityAdvisor({
      question: 'How to seal doors during smog with damp towels?',
      aqiData: mockAqiData,
      familyMembers: DEFAULT_FAMILY_MEMBERS
    });
    assert.ok(res.text.length > 0);
    assert.ok(res.impactHighlight);
  });
});
