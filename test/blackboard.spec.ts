import { Blackboard } from '@Blackboard';

describe('Blackboard', () => {
  let blackboard: Blackboard;

  beforeEach(() => {
    blackboard = new Blackboard();
  });

  it('should set and get a value by key', () => {
    const key = 'foo';
    const value = 'bar';
    blackboard.set(key, value);
    expect(blackboard.get(key)).toBe(value);
  });

  it('should check if a key exists', () => {
    const key = 'foo';
    expect(blackboard.has(key)).toBe(false);
    blackboard.set(key, 'bar');
    expect(blackboard.has(key)).toBe(true);
  });

  it('should remove a key-value pair by key', () => {
    const key = 'foo';
    blackboard.set(key, 'bar');
    blackboard.remove(key);
    expect(blackboard.get(key)).toBeUndefined();
  });

  it('should clear all key-value pairs', () => {
    blackboard.set('foo', 'bar');
    blackboard.set('baz', 'qux');
    blackboard.clear();
    expect(blackboard.has('foo')).toBe(false);
    expect(blackboard.has('baz')).toBe(false);
  });
});
