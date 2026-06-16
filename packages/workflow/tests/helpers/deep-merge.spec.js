import deepMerge from '../../helpers/deep-merge.js';

describe('deepMerge', () => {
  it('merges flat objects', () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('deeply merges nested objects', () => {
    expect(deepMerge({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } });
  });

  it('overwrites arrays (no concatenation)', () => {
    expect(deepMerge({ a: [1, 2] }, { a: [3] })).toEqual({ a: [3] });
  });

  it('overwrites primitives', () => {
    expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
  });

  it('skips null and undefined sources', () => {
    expect(deepMerge({ a: 1 }, null, undefined, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('skips undefined values in source', () => {
    expect(deepMerge({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
  });

  it('handles multiple sources in order (last wins)', () => {
    expect(deepMerge({}, { a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 });
  });

  it('returns the target object reference', () => {
    const target = { a: 1 };
    const result = deepMerge(target, { b: 2 });
    expect(result).toBe(target);
  });

  it('does not merge non-plain objects (class instances)', () => {
    class Foo {
 x = 1;
}
    const foo = new Foo();
    const result = deepMerge({ a: { old: true } }, { a: foo });
    expect(result.a).toBe(foo);
  });

  it('rejects __proto__ key (prototype pollution)', () => {
    const target = {};
    deepMerge(target, JSON.parse('{"__proto__":{"polluted":true}}'));
    expect(({}).polluted).toBeUndefined();
    expect(target.polluted).toBeUndefined();
  });

  it('rejects constructor key', () => {
    const target = {};
    deepMerge(target, { constructor: { polluted: true } });
    expect(target.constructor).toBe(Object);
  });

  it('rejects prototype key', () => {
    const target = {};
    deepMerge(target, { prototype: { polluted: true } });
    expect(target.prototype).toBeUndefined();
  });
});
