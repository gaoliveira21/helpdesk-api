import { Hour, Uuid } from '../value_objects';
import { AdminEntity } from './admin.entity';

import { TechnicianEntity } from './technician.entity';

describe('TechnicianEntity', () => {
  const createdBy = AdminEntity.restore({
    id: new Uuid().toString(),
    name: 'Admin User',
    email: 'admin.user@example.com',
    passwordHash: 'adminpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it('should create a TechnicianEntity with default shift when no shift is provided', async () => {
    const technician = await TechnicianEntity.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      plainTextPassword: 'password123',
      createdBy,
    });

    expect(technician).toBeInstanceOf(TechnicianEntity);
    expect(technician.shift).toEqual(TechnicianEntity.DEFAULT_SHIFT);
    expect(technician.shift.length).toBe(10);
  });

  it('should create a TechnicianEntity with provided shift', async () => {
    const customShift = [8, 9, 10, 11, 12];
    const technician = await TechnicianEntity.create({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      plainTextPassword: 'password456',
      createdBy,
      shift: customShift,
    });

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

    const technician = TechnicianEntity.restore({
      id,
      name,
      email,
      passwordHash,
      shift,
      createdBy,
      createdAt,
      updatedAt,
    });

    expect(technician).toBeInstanceOf(TechnicianEntity);
    expect(technician.shift).toEqual(shift.map((hour) => new Hour(hour)));
    expect(technician.shift.length).toBe(shift.length);
  });

  it('should have a proper string representation', async () => {
    const customShift = [8, 9, 10, 11, 12];
    const technician = await TechnicianEntity.create({
      name: 'Bob Brown',
      email: 'bob.brown@example.com',
      plainTextPassword: 'password789',
      createdBy,
      shift: customShift,
    });

    expect(technician).toBeInstanceOf(TechnicianEntity);
    expect(technician.toString()).toBe(
      `TechnicianEntity { id: ${technician.id.toString()}, name: ${technician.name}, email: ${technician.email.toString()}, createdAt: ${technician.createdAt.toISOString()}, updatedAt: ${technician.updatedAt.toISOString()}, shift: [${technician.shift
        .map((hour) => hour.toString())
        .join(', ')}], createdBy: ${technician.createdBy.toString()} }`,
    );
  });

  it('should change the shift of the technician', async () => {
    const technician = await TechnicianEntity.create({
      name: 'Charlie Green',
      email: 'charlie.green@example.com',
      plainTextPassword: 'password123',
      createdBy,
    });
    const previousUpdatedAt = technician.updatedAt;

    technician.changeShift([9, 10, 11, 12, 13]);
    expect(technician.shift.map((hour) => hour.value)).toEqual([
      9, 10, 11, 12, 13,
    ]);
    expect(technician.shift.length).toBe(5);
    expect(technician.updatedAt).not.toBe(previousUpdatedAt);
  });

  it('should change the name of the technician', async () => {
    const technician = await TechnicianEntity.create({
      name: 'Diana White',
      email: 'diana.white@example.com',
      plainTextPassword: 'password123',
      createdBy,
    });
    const previousUpdatedAt = technician.updatedAt;

    technician.changeName('Diana Black');
    expect(technician.name).toBe('Diana Black');
    expect(technician.updatedAt).not.toBe(previousUpdatedAt);
  });

  it('should change the email of the technician', async () => {
    const technician = await TechnicianEntity.create({
      name: 'Ethan Blue',
      email: 'ethan.blue@example.com',
      plainTextPassword: 'password123',
      createdBy,
    });
    const previousUpdatedAt = technician.updatedAt;

    technician.changeEmail('ethan.new@example.com');
    expect(technician.email.value).toBe('ethan.new@example.com');
    expect(technician.updatedAt).not.toBe(previousUpdatedAt);
  });
});
