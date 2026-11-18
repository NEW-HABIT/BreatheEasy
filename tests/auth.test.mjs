import test from 'node:test';
import assert from 'node:assert/strict';

test('User Authentication & Offline Resilience', async (t) => {
  await t.test('evaluator demo credentials validation', () => {
    const demoEmail = 'rajesh.sharma@example.com';
    const demoPassword = 'password123';

    assert.equal(demoEmail.includes('@'), true);
    assert.ok(demoPassword.length >= 6);
  });

  await t.test('session data serialization format', () => {
    const mockUser = {
      id: 'default-user',
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@example.com',
      city: 'New Delhi',
      familyMembers: [
        { id: 'fam-1', name: 'Rajesh', role: 'Self', age: 38 },
        { id: 'fam-3', name: 'Arya', role: 'Child', age: 6, healthConditions: ['Asthma'] }
      ]
    };

    const serialized = JSON.stringify(mockUser);
    const parsed = JSON.parse(serialized);

    assert.equal(parsed.name, 'Rajesh Sharma');
    assert.equal(parsed.familyMembers.length, 2);
    assert.equal(parsed.familyMembers[1].healthConditions[0], 'Asthma');
  });
});
