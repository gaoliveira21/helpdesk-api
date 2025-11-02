import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertUserRoles1762034153047 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('users_roles', [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'Technician' },
      { id: 3, name: 'Customer' },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('users_roles', [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  }
}
