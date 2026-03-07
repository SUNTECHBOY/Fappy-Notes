import { migrateDataToSupabase } from '../src/app/services/migrateData.ts';

async function run() {
  console.log('Starting migration runner...');
  try {
    const result = await migrateDataToSupabase();
    console.log('Migration result:', result);
    process.exit(result.success ? 0 : 1);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
