import { describe, it } from 'node:test';
import assert from 'node:assert';
import { activeAgents, nextRotation } from './watcher.js';

describe('watcher / chokar', () => {
  it('oscar is always active', () => {
    assert.ok(activeAgents().includes('oscar'));
  });

  it('nextRotation pivot is 6 or 22', () => {
    const { nextPivot } = nextRotation();
    assert.ok([6, 22].includes(nextPivot));
  });

  it('activeAgents returns an array', () => {
    assert.ok(Array.isArray(activeAgents()));
  });
});
