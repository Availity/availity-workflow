import { describe, test, expect } from 'vitest';
import * as yup from 'yup';
import { avDate } from '@availity/yup';
import dayjs from 'dayjs';

// This test exercises @availity/yup's avDate schema which internally imports
// dayjs/plugin/customParseFormat (without .js extension). It serves as a
// regression test for ESM resolution of CJS packages without exports maps.

describe('@availity/yup avDate', () => {
  const schema = avDate();

  test('validates a correct date string', async () => {
    await expect(schema.validate('01/01/2025')).resolves.toBeDefined();
  });

  test('validates a dayjs object', async () => {
    const date = dayjs('2025-01-15');
    await expect(schema.validate(date)).resolves.toBeDefined();
  });

  test('rejects an invalid date string', async () => {
    await expect(schema.validate('not-a-date')).rejects.toThrow();
  });

  test('works within an object schema', async () => {
    const objectSchema = yup.object({
      startDate: avDate().required(),
    });

    await expect(objectSchema.validate({ startDate: '12/25/2025' })).resolves.toBeDefined();
    await expect(objectSchema.validate({ startDate: '' })).rejects.toThrow();
  });
});
