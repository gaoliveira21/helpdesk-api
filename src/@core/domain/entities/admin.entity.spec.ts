import { Uuid } from '../value_objects/uuid.vo';
import { AdminEntity } from './admin.entity';
import { TechnicianEntity } from './technician.entity';

describe('AdminEntity', () => {
  it('should create a new AdminEntity', async () => {
    const admin = await AdminEntity.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      plainTextPassword: 'mySecurePassword',
    });
    expect(admin).toBeInstanceOf(AdminEntity);
    expect(admin.id).toBeDefined();
    expect(admin.name).toBe('John Doe');
    expect(admin.passwordHash).toBeDefined();
    expect(admin.passwordHash).not.toBe('mySecurePassword');
    expect(admin.email.value).toBe('john.doe@example.com');
    expect(admin.createdAt).toBeInstanceOf(Date);
    expect(admin.updatedAt).toBeInstanceOf(Date);
  });

  it('should restore an existing AdminEntity', () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    const id = new Uuid().value;
    const admin = AdminEntity.restore({
      id,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      passwordHash: 'hashedPassword123',
      createdAt,
      updatedAt,
    });
    expect(admin).toBeInstanceOf(AdminEntity);
    expect(admin.id.value).toBe(id);
    expect(admin.name).toBe('Jane Doe');
    expect(admin.email.value).toBe('jane.doe@example.com');
    expect(admin.passwordHash.value).toBe('hashedPassword123');
    expect(admin.createdAt).toBe(createdAt);
    expect(admin.updatedAt).toBe(updatedAt);
  });

  it('should check equality between two AdminEntity instances', async () => {
    const admin1 = await AdminEntity.create({
      name: 'Alice',
      email: 'alice@example.com',
      plainTextPassword: 'mySecurePassword',
    });
    const admin2 = AdminEntity.restore({
      id: admin1.id.value,
      name: admin1.name,
      email: admin1.email.value,
      passwordHash: admin1.passwordHash.value,
      createdAt: admin1.createdAt,
      updatedAt: admin1.updatedAt,
    });
    const admin3 = await AdminEntity.create({
      name: 'Bob',
      email: 'bob@example.com',
      plainTextPassword: 'anotherPassword',
    });

    expect(admin1.isEqual(admin2)).toBe(true);
    expect(admin1.isEqual(admin3)).toBe(false);
  });

  it('should convert AdminEntity to string', async () => {
    const admin = await AdminEntity.create({
      name: 'Charlie',
      email: 'charlie@example.com',
      plainTextPassword: 'pass123',
    });
    expect(admin.toString()).toBe(
      `AdminEntity { id: ${admin.id.value}, name: Charlie, email: charlie@example.com, createdAt: ${admin.createdAt.toISOString()}, updatedAt: ${admin.updatedAt.toISOString()} }`,
    );
  });

  it('should convert AdminEntity to JSON', async () => {
    const admin = await AdminEntity.create({
      name: 'Dave',
      email: 'dave@example.com',
      plainTextPassword: 'pass123',
    });
    expect(admin.toJSON()).toEqual({
      id: admin.id.value,
      name: admin.name,
      email: admin.email.value,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
    });
  });

  it('should create a TechnicianEntity from AdminEntity', async () => {
    const admin = await AdminEntity.create({
      name: 'Eve',
      email: 'eve@example.com',
      plainTextPassword: 'pass123',
    });
    const technician = await admin.createTechnician({
      name: 'Tech One',
      email: 'tech.one@example.com',
      plainTextPassword: 'pass123',
    });
    expect(technician).toBeInstanceOf(TechnicianEntity);
    expect(technician.id).toBeDefined();
    expect(technician.name).toBe('Tech One');
    expect(technician.email.value).toBe('tech.one@example.com');
    expect(technician.passwordHash).toBeDefined();
    expect(technician.passwordHash).not.toBe('pass123');
    expect(technician.createdBy.id.value).toBe(admin.id.value);
    expect(technician.createdAt).toBeInstanceOf(Date);
    expect(technician.updatedAt).toBeInstanceOf(Date);
  });
});
