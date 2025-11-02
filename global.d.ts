import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';

declare global {
  var __DB_CONTAINER__: StartedPostgreSqlContainer | undefined;
}
