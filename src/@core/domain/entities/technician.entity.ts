import { Email, Uuid, PasswordHash, Hour } from '../value_objects';
import { AdminEntity } from './admin.entity';

import { UserEntity } from './user.entity';

export type CreateTechnicianProps = {
  name: string;
  email: string;
  plainTextPassword: string;
  createdBy: AdminEntity;
  shift?: number[];
};

export type RestoreTechnicianProps = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  shift: number[];
  createdBy: AdminEntity;
  createdAt: Date;
  updatedAt: Date;
};

export class TechnicianEntity extends UserEntity {
  public static readonly DEFAULT_SHIFT: Hour[] = [
    new Hour(8),
    new Hour(9),
    new Hour(10),
    new Hour(11),
    new Hour(12),
    new Hour(13),
    new Hour(14),
    new Hour(15),
    new Hour(16),
    new Hour(17),
  ];
  private _shift: Hour[];
  private _createdBy: AdminEntity;

  private constructor(
    id: Uuid,
    name: string,
    email: Email,
    passwordHash: PasswordHash,
    shift: Hour[],
    createdBy: AdminEntity,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, name, email, passwordHash, createdAt, updatedAt);
    this._shift = shift;
    this._createdBy = createdBy;
  }

  static async create({
    name,
    email,
    plainTextPassword,
    createdBy,
    shift,
  }: CreateTechnicianProps): Promise<TechnicianEntity> {
    const passwordHash = await PasswordHash.create(plainTextPassword);
    return new TechnicianEntity(
      new Uuid(),
      name,
      new Email(email),
      passwordHash,
      shift
        ? shift.map((hour) => new Hour(hour))
        : TechnicianEntity.DEFAULT_SHIFT,
      createdBy,
    );
  }

  static restore({
    id,
    name,
    email,
    passwordHash,
    shift,
    createdBy,
    createdAt,
    updatedAt,
  }: RestoreTechnicianProps): TechnicianEntity {
    return new TechnicianEntity(
      new Uuid(id),
      name,
      new Email(email),
      PasswordHash.fromHash(passwordHash),
      shift.map((hour) => new Hour(hour)),
      createdBy,
      createdAt,
      updatedAt,
    );
  }

  get shift(): Hour[] {
    return this._shift;
  }

  get createdBy(): AdminEntity {
    return this._createdBy;
  }

  changeShift(newShift: number[]): void {
    this._shift = newShift.map((hour) => new Hour(hour));
    this._updatedAt = new Date();
  }

  changeName(newName: string): void {
    this._name = newName;
    this._updatedAt = new Date();
  }

  changeEmail(newEmail: string): void {
    this._email = new Email(newEmail);
    this._updatedAt = new Date();
  }

  toString(): string {
    return `TechnicianEntity { id: ${this._id.toString()}, name: ${this._name}, email: ${this._email.toString()}, createdAt: ${this._createdAt.toISOString()}, updatedAt: ${this._updatedAt.toISOString()}, shift: [${this._shift
      .map((hour) => hour.toString())
      .join(', ')}], createdBy: ${this._createdBy.toString()} }`;
  }
}
