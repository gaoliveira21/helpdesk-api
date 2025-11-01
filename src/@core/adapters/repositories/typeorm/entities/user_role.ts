import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users_roles')
export class UserRole {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;
}
