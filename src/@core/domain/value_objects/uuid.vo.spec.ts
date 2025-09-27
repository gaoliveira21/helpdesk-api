import { version, validate, v7 as uuidV7 } from 'uuid';

import { Uuid } from './uuid.vo';

describe('UUID Value Object', () => {
  it('should create a valid uuid v7', () => {
    const uuid = new Uuid();
    expect(validate(uuid.value)).toBeTruthy();
    expect(version(uuid.value)).toBe(7);
  });

  it('should create a valid uuid v7 from a given value', () => {
    const validUuidV7 = uuidV7();
    const uuid = new Uuid(validUuidV7);
    expect(uuid.value).toBe(validUuidV7);
  });

  it('should throw an error for an invalid uuid', () => {
    expect(() => new Uuid('invalid-uuid')).toThrow('Invalid UUID format');
  });

  it('should validate a valid uuid', () => {
    const validUuidV7 = uuidV7();
    expect(Uuid.validate(validUuidV7)).toBe(true);
  });

  it('should invalidate an invalid uuid', () => {
    expect(Uuid.validate('invalid-uuid')).toBe(false);
  });

  it('should compare two uuids for equality', () => {
    const uuid1 = new Uuid();
    const uuid2 = new Uuid(uuid1.value);
    const uuid3 = new Uuid();

    expect(uuid1.isEqual(uuid2)).toBe(true);
    expect(uuid1.isEqual(uuid3)).toBe(false);
  });

  it('should return the string representation of the uuid', () => {
    const uuid = new Uuid();
    expect(uuid.toString()).toBe(uuid.value);
  });
});
