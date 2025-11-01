import typeorm from 'typeorm';

export class CreateUsersRolesTable1762033699911
  implements typeorm.MigrationInterface
{
  public async up(queryRunner: typeorm.QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new typeorm.Table({
        name: 'users_roles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: typeorm.QueryRunner): Promise<void> {
    await queryRunner.dropTable('users_roles');
  }
}
