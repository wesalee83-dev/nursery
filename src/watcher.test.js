import { describe, it } from 'node:test';
import assert from 'node:assert';
import { activeAgents, nextRotation } from './watcher.js';

describe('chokar/watcher', () => {
  it('always includes oscar', () => {
    assert.ok(activeAgents().includes('oscar'));
  });

  it('nextRotation returns a pivot hour', () => {
    const { nextPivot } = nextRotation();
    assert.ok([6, 22].includes(nextPivot));
  });
});
