import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  DEFAULT_FAMILY_MEMBERS, 
  DEFAULT_USER_PROFILE, 
  INITIAL_COMMUNITY_POSTS 
} from '../src/lib/store.ts';

test('Data Store & Family Profile Archetypes', async (t) => {
  await t.test('default family members represent complete multi-generational cohort', () => {
    assert.equal(DEFAULT_FAMILY_MEMBERS.length, 4);
    
    // Check pediatric asthma archetype
    const child = DEFAULT_FAMILY_MEMBERS.find(m => m.role === 'Child');
    assert.ok(child);
    assert.equal(child.age, 6);
    assert.ok(child.healthConditions.includes('Asthma'));

    // Check geriatric cardiovascular archetype
    const elder = DEFAULT_FAMILY_MEMBERS.find(m => m.role === 'Elderly');
    assert.ok(elder);
    assert.equal(elder.age, 68);
    assert.ok(elder.healthConditions.includes('Hypertension'));
  });

  await t.test('default user profile initializes with sustainable defaults', () => {
    assert.equal(DEFAULT_USER_PROFILE.city, 'New Delhi');
    assert.equal(DEFAULT_USER_PROFILE.homeType, 'Apartment');
    assert.equal(DEFAULT_USER_PROFILE.hasPurifier, true);
    assert.equal(DEFAULT_USER_PROFILE.commuteMode, 'Metro/Train');
    assert.equal(DEFAULT_USER_PROFILE.familyMembers.length, 4);
  });

  await t.test('community board posts cover grassroots anti-pollution initiatives', () => {
    assert.ok(INITIAL_COMMUNITY_POSTS.length >= 4);
    
    const antiBurningPost = INITIAL_COMMUNITY_POSTS.find(p => p.type === 'initiative');
    assert.ok(antiBurningPost);
    assert.ok(antiBurningPost.upvotes > 0);
    assert.ok(antiBurningPost.participantsCount > 0);

    const workshopPost = INITIAL_COMMUNITY_POSTS.find(p => p.type === 'event');
    assert.ok(workshopPost);
    assert.ok(workshopPost.title.includes('MERV-13'));
  });
});
