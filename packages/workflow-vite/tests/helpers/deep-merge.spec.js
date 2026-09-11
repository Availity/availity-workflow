import deepMerge from '../../helpers/deep-merge.js';

describe('deepMerge()', () => {
  it('merges flat objects', () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('deeply merges nested plain objects', () => {
    expect(deepMerge({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } });
  });

  it('last source wins for primitive values', () => {
    expect(deepMerge({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 });
  });

  it('replaces arrays (does not concatenate)', () => {
    expect(deepMerge({ a: [1, 2] }, { a: [3] })).toEqual({ a: [3] });
  });

  it('skips null sources', () => {
    expect(deepMerge({ a: 1 }, null, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('skips undefined sources', () => {
    expect(deepMerge({ a: 1 }, undefined, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('skips undefined values within a source', () => {
    expect(deepMerge({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
  });

  it('returns the target object by reference', () => {
    const target = { a: 1 };
    const result = deepMerge(target, { b: 2 });
    expect(result).toBe(target);
  });

  it('does not merge non-plain objects (class instances replace)', () => {
    class Foo {
      x = 1;
    }
    const foo = new Foo();
    const result = deepMerge({ a: { old: true } }, { a: foo });
    expect(result.a).toBe(foo);
  });

  it('handles multiple sources in order', () => {
    expect(deepMerge({}, { a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  // prototype pollution guards
  it('ignores __proto__ key', () => {
    const target = {};
    deepMerge(target, JSON.parse('{"__proto__":{"polluted":true}}'));
    expect({}.polluted).toBeUndefined();
  });

  it('ignores constructor key', () => {
    const target = {};
    deepMerge(target, { constructor: { polluted: true } });
    expect(target.constructor).toBe(Object);
  });

  it('ignores prototype key', () => {
    const target = {};
    deepMerge(target, { prototype: { polluted: true } });
    expect(target.prototype).toBeUndefined();
  });
});
