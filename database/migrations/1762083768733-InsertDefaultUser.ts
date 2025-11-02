import typeorm from 'typeorm';
import bcrypt from 'bcryptjs';
import { v7 as uuidv7 } from 'uuid';

export class InsertDefaultUser1762083768733
  implements typeorm.MigrationInterface
{
  private readonly id = uuidv7();

  public async up(queryRunner: typeorm.QueryRunner): Promise<void> {
    const email = process.env.DEFAULT_ADMIN_EMAIL;
    const password = process.env.DEFAULT_ADMIN_PASSWORD;
    const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS);

    if (!email || !password || !saltRounds) {
      throw new Error(
        'DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, and PASSWORD_SALT_ROUNDS must be set in environment variables',
      );
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await queryRunner.manager.insert('users', {
      id: this.id,
      name: 'Admin',
      email,
      password_hash: hashedPassword,
      role_id: 1,
    });
  }

  public async down(queryRunner: typeorm.QueryRunner): Promise<void> {
    await queryRunner.manager.delete('users', { id: this.id });
  }
}
