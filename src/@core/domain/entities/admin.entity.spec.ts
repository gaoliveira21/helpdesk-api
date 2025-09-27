import { Uuid } from '../value_objects/uuid.vo';
import { AdminEntity } from './admin.entity';

describe('AdminEntity', () => {
  it('should create a new AdminEntity', () => {
    const admin = AdminEntity.create('John Doe', 'john.doe@example.com');
    expect(admin).toBeInstanceOf(AdminEntity);
    expect(admin.id).toBeDefined();
    expect(admin.name).toBe('John Doe');
    expect(admin.email.value).toBe('john.doe@example.com');
    expect(admin.createdAt).toBeInstanceOf(Date);
    expect(admin.updatedAt).toBeInstanceOf(Date);
  });

  it('should restore an existing AdminEntity', () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    const id = new Uuid().value;
    const admin = AdminEntity.restore(
      id,
      'Jane Doe',
      'jane.doe@example.com',
      createdAt,
      updatedAt,
    );
    expect(admin).toBeInstanceOf(AdminEntity);
    expect(admin.id.value).toBe(id);
    expect(admin.name).toBe('Jane Doe');
    expect(admin.email.value).toBe('jane.doe@example.com');
    expect(admin.createdAt).toBe(createdAt);
    expect(admin.updatedAt).toBe(updatedAt);
  });

  it('should check equality between two AdminEntity instances', () => {
    const admin1 = AdminEntity.create('Alice', 'alice@example.com');
    const admin2 = AdminEntity.restore(
      admin1.id.value,
      admin1.name,
      admin1.email.value,
      admin1.createdAt,
      admin1.updatedAt,
    );
    const admin3 = AdminEntity.create('Bob', 'bob@example.com');

    expect(admin1.isEqual(admin2)).toBe(true);
    expect(admin1.isEqual(admin3)).toBe(false);
  });

  it('should convert AdminEntity to string', () => {
    const admin = AdminEntity.create('Charlie', 'charlie@example.com');
    expect(admin.toString()).toBe(
      `AdminEntity { id: ${admin.id.value}, name: Charlie, email: charlie@example.com, createdAt: ${admin.createdAt.toISOString()}, updatedAt: ${admin.updatedAt.toISOString()} }`,
    );
  });

  it('should convert AdminEntity to JSON', () => {
    const admin = AdminEntity.create('Dave', 'dave@example.com');
    expect(admin.toJSON()).toEqual({
      id: admin.id.value,
      name: admin.name,
      email: admin.email.value,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
    });
  });
});
