import { Hour, Uuid } from '../value_objects';

import { TechnicianEntity } from './technician.entity';

describe('TechnicianEntity', () => {
  it('should create a TechnicianEntity with default shift when no shift is provided', async () => {
    const technician = await TechnicianEntity.create(
      'John Doe',
      'john.doe@example.com',
      'password123',
    );

    expect(technician).toBeInstanceOf(TechnicianEntity);
    expect(technician.shift).toEqual(TechnicianEntity.DEFAULT_SHIFT);
    expect(technician.shift.length).toBe(10);
  });

  it('should create a TechnicianEntity with provided shift', async () => {
    const customShift = [8, 9, 10, 11, 12];
    const technician = await TechnicianEntity.create(
      'Jane Smith',
      'jane.smith@example.com',
      'password456',
      customShift,
    );

    expect(technician).toBeInstanceOf(TechnicianEntity);
    expect(technician.shift).toEqual(customShift.map((hour) => new Hour(hour)));
    expect(technician.shift.length).toBe(customShift.length);
  });

  it('should restore a TechnicianEntity from given data', () => {
    const id = new Uuid().toString();
    const name = 'Alice Johnson';
    const email = 'alice.johnson@example.com';
    const passwordHash = 'hashedpassword';
    const shift = [8, 9, 10, 11, 12];
    const createdAt = new Date();
    const updatedAt = new Date();

    const technician = TechnicianEntity.restore(
      id,
      name,
      email,
      passwordHash,
      shift,
      createdAt,
      updatedAt,
    );

    expect(technician).toBeInstanceOf(TechnicianEntity);
    expect(technician.shift).toEqual(shift.map((hour) => new Hour(hour)));
    expect(technician.shift.length).toBe(shift.length);
  });

  it('should have a proper string representation', async () => {
    const customShift = [8, 9, 10, 11, 12];
    const technician = await TechnicianEntity.create(
      'Bob Brown',
      'bob.brown@example.com',
      'password789',
      customShift,
    );

    expect(technician).toBeInstanceOf(TechnicianEntity);
    expect(technician.toString()).toBe(
      `TechnicianEntity { id: ${technician.id.toString()}, name: ${technician.name}, email: ${technician.email.toString()}, createdAt: ${technician.createdAt.toISOString()}, updatedAt: ${technician.updatedAt.toISOString()}, shift: [${technician.shift
        .map((hour) => hour.toString())
        .join(', ')}] }`,
    );
  });
});
