import { setupDatabase } from '../src/database';

async function setup() {
  await setupDatabase(true);
}

export default setup;
