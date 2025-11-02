export default async function () {
  console.info('Tearing down E2E test database container...');
  const container = globalThis.__DB_CONTAINER__;
  if (container) {
    await container.stop();
    console.info('E2E test database container stopped.');
  } else {
    console.warn('No E2E test database container found to stop.');
  }
}
