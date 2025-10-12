import { Uuid } from '../value_objects';
import { CustomerEntity } from './customer.entity';

describe('CustomerEntity', () => {
  it('should create a new CustomerEntity', async () => {
    const customer = await CustomerEntity.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      plainTextPassword: 'password123',
    });

    expect(customer).toBeInstanceOf(CustomerEntity);
    expect(customer.id).toBeDefined();
    expect(customer.name).toBe('John Doe');
    expect(customer.passwordHash).toBeDefined();
    expect(customer.passwordHash).not.toBe('mySecurePassword');
    expect(customer.email.value).toBe('john.doe@example.com');
    expect(customer.createdAt).toBeInstanceOf(Date);
    expect(customer.updatedAt).toBeInstanceOf(Date);
  });

  it('should restore an existing CustomerEntity', () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    const id = new Uuid().value;
    const customer = CustomerEntity.restore({
      id,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      passwordHash: 'hashedPassword123',
      createdAt,
      updatedAt,
    });
    expect(customer).toBeInstanceOf(CustomerEntity);
    expect(customer.id.value).toBe(id);
    expect(customer.name).toBe('Jane Doe');
    expect(customer.email.value).toBe('jane.doe@example.com');
    expect(customer.passwordHash.value).toBe('hashedPassword123');
    expect(customer.createdAt).toBe(createdAt);
    expect(customer.updatedAt).toBe(updatedAt);
  });

  it('should check equality between two CustomerEntity instances', async () => {
    const customer1 = await CustomerEntity.create({
      name: 'Alice',
      email: 'alice@example.com',
      plainTextPassword: 'mySecurePassword',
    });
    const customer2 = CustomerEntity.restore({
      id: customer1.id.value,
      name: customer1.name,
      email: customer1.email.value,
      passwordHash: customer1.passwordHash.value,
      createdAt: customer1.createdAt,
      updatedAt: customer1.updatedAt,
    });
    const customer3 = await CustomerEntity.create({
      name: 'Bob',
      email: 'bob@example.com',
      plainTextPassword: 'anotherPassword',
    });

    expect(customer1.isEqual(customer2)).toBe(true);
    expect(customer1.isEqual(customer3)).toBe(false);
  });

  it('should convert CustomerEntity to string', async () => {
    const customer = await CustomerEntity.create({
      name: 'Charlie',
      email: 'charlie@example.com',
      plainTextPassword: 'pass123',
    });
    expect(customer.toString()).toBe(
      `CustomerEntity { id: ${customer.id.value}, name: Charlie, email: charlie@example.com, createdAt: ${customer.createdAt.toISOString()}, updatedAt: ${customer.updatedAt.toISOString()} }`,
    );
  });

  it('should convert CustomerEntity to JSON', async () => {
    const customer = await CustomerEntity.create({
      name: 'Dave',
      email: 'dave@example.com',
      plainTextPassword: 'pass123',
    });
    expect(customer.toJSON()).toEqual({
      id: customer.id.value,
      name: customer.name,
      email: customer.email.value,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    });
  });

  it('should change the name of the customer', async () => {
    const customer = await CustomerEntity.create({
      name: 'Diana White',
      email: 'diana.white@example.com',
      plainTextPassword: 'password123',
    });
    const previousUpdatedAt = customer.updatedAt;

    customer.changeName('Diana Black');
    expect(customer.name).toBe('Diana Black');
    expect(customer.updatedAt).not.toBe(previousUpdatedAt);
  });
});
