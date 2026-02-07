
# Patterns in the Project

**[← Back to Structure](./structure.md) | [Architecture Overview →](../README.md)**

This document explains key architectural patterns used in the project, with real code examples.


## Dependency Injection

Dependency Injection decouples classes from their dependencies. Dependencies are provided via constructors.

```mermaid
flowchart LR
  AdminRepo["AdminRepository"]
  TechRepo["TechnicianRepository"]
  UseCase["UpdateTechnician UseCase"]
  AdminRepo --> UseCase
  TechRepo --> UseCase
```

**Example:**

```typescript
export class UpdateTechnician implements UpdateTechnicianUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly technicianRepository: TechnicianRepository,
  ) {}
  // ...
}
```


## Repository Pattern

Repositories abstract data access, providing a collection-like interface for domain entities.

```mermaid
flowchart LR
  UseCase["Use Case"]
  RepoPort["UserRepository (Port)"]
  RepoImpl["TypeORMUserRepository (Adapter)"]
  DB[("Database")]
  UseCase --> RepoPort
  RepoPort -.-> RepoImpl
  RepoImpl --> DB
```

**Port (Interface):**
```typescript
export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<void>;
}
```

**Adapter (Implementation):**
```typescript
export class TypeORMUserRepository implements UserRepository {
  private readonly userRepo: Repository<User>;
  constructor(dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User);
  }
  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) return null;
    return user.toDomain();
  }
  // ...
}
```


## Use Case Pattern

Use cases encapsulate application logic and orchestrate domain operations.

```mermaid
flowchart LR
  Controller["Controller"]
  UseCase["Use Case"]
  RepoPort["Repository Port"]
  RepoImpl["Repository Adapter"]
  Controller --> UseCase
  UseCase --> RepoPort
  RepoPort -.-> RepoImpl
```

**Example:**
```typescript
export class UpdateTechnician implements UpdateTechnicianUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly technicianRepository: TechnicianRepository,
  ) {}
  async execute(input: UpdateTechnicianInput): Promise<Result<void>> {
    // ...
  }
}
```


## Adapter Pattern

Adapters implement interfaces (ports) to connect the application to external systems or infrastructure.

```mermaid
flowchart LR
  AppPort["Application Port (e.g., JwtSigner)"]
  Adapter["Adapter (e.g., JwtProvider)"]
  External["External Service (e.g., JWT lib)"]
  AppPort -.-> Adapter
  Adapter --> External
```

**Example:**
```typescript
export class JwtProvider implements JwtSigner, JwtVerifier {
  private readonly _secret: string;
  constructor(private readonly confProvider: ConfProvider) {
    this._secret = this.confProvider.get('auth.secret');
  }
  async sign(payload: Record<string, unknown>, ttl: TimeDuration): Promise<string> {
    // ...
  }
  async verify<T = Record<string, unknown>>(token: string) {
    // ...
  }
}
```

---


---

For project structure and layering, see [structure.md](./structure.md).
