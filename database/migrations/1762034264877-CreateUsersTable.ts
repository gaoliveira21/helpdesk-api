import typeorm from 'typeorm';

export class CreateUsersTable1762034264877
  implements typeorm.MigrationInterface
{
  public async up(queryRunner: typeorm.QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new typeorm.Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '1024',
          },
          {
            name: 'role_id',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['role_id'],
            referencedTableName: 'users_roles',
            referencedColumnNames: ['id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: typeorm.QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
