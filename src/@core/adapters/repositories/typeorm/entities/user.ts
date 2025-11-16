import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  TableInheritance,
} from 'typeorm';

import { UserEntity } from 'src/@core/domain/entities';

import { UserRole } from './user_role';

@Entity('users')
@TableInheritance({ column: { type: 'varchar', name: 'user_type' } })
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'role_id' })
  roleId: number;

  @ManyToOne(() => UserRole)
  @JoinColumn({ name: 'role_id' })
  role: UserRole;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  static fromDomain(userEntity: UserEntity): User {
    const user = new User();
    user.id = userEntity.id.value;
    user.name = userEntity.name;
    user.email = userEntity.email.value;
    user.passwordHash = userEntity.passwordHash.value;
    user.roleId = userEntity.role;
    user.createdAt = userEntity.createdAt;
    user.updatedAt = userEntity.updatedAt;
    return user;
  }

  toDomain(): UserEntity {
    return UserEntity.restore({
      id: this.id,
      name: this.name,
      email: this.email,
      passwordHash: this.passwordHash,
      role: this.roleId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
