import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

export default async function () {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env.test'),
    quiet: true,
  });

  console.info('\nSetting up E2E test database container...');
  const dbSettings = {
    username: 'postgres',
    password: 'postgres',
    dbname: 'helpdesk_test',
  };
  const container = await new PostgreSqlContainer('postgres:18-alpine')
    .withUsername(dbSettings.username)
    .withPassword(dbSettings.password)
    .withDatabase(dbSettings.dbname)
    .start();

  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = container.getPort().toString();
  process.env.DB_USERNAME = dbSettings.username;
  process.env.DB_PASSWORD = dbSettings.password;
  process.env.DB_NAME = dbSettings.dbname;

  console.info('E2E test database container is running.');
  const dataSource = new DataSource({
    type: 'postgres',
    host: container.getHost(),
    port: container.getPort(),
    username: dbSettings.username,
    password: dbSettings.password,
    database: dbSettings.dbname,
    migrations: [path.join(process.cwd(), 'database', 'migrations', '*.ts')],
  });

  console.info('Initializing database connection and running migrations...');
  await dataSource.initialize();
  await dataSource.runMigrations();

  console.info('Database migrations completed, E2E test database is ready.');
  globalThis.__DB_CONTAINER__ = container;
}
