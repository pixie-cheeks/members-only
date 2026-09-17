#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { pool } from './pool.js';
import * as tableSeeder from './tableSeeder.js';

const { dirname } = import.meta;
const schemaSqlPath = path.resolve(dirname, './schema.sql');
const schemaSQL = await fs.readFile(schemaSqlPath, { encoding: 'utf8' });

const dropTables = async (): Promise<void> => {
  console.log('Dropping tables...');
  await tableSeeder.dropTables();
  console.log(
    'Successfully dropped all tables! Skipped if there were no tables.',
  );
};

const createTables = async (): Promise<void> => {
  console.log('Creating tables...');
  await pool.query(schemaSQL);
  console.log(
    'Creating tables was successful! Skipped if the tables were already created.',
  );
};

const resetTables = async (): Promise<void> => {
  console.log('Resetting tables...');
  try {
    await tableSeeder.resetTables();
    console.log('Resetting tables was successful!');
  } catch {
    console.error(
      "Failed to reset the tables. Maybe the given tables don't exist yet.",
    );
  }
};

const seedTables = async (): Promise<void> => {
  console.log('Seeding those tables...');
  await tableSeeder.seedTables();
  console.log('Seeding tables was successful!');
};

const doSeedingProcedure = async (): Promise<void> => {
  const parameter = process.argv.at(3);
  const shouldReset = parameter === '-r' || parameter === '--reset';
  const shouldDrop = parameter === '-d' || parameter === '--drop';

  if (shouldDrop) await dropTables();
  await createTables();
  if (shouldReset) await resetTables();
  await seedTables();
};

switch (process.argv.at(2)) {
  case 'create': {
    await createTables();
    break;
  }
  case 'drop': {
    await dropTables();
    break;
  }
  case 'reset': {
    await resetTables();
    break;
  }
  case 'seed': {
    await doSeedingProcedure();
    break;
  }
  default: {
    console.log('Use the following subcommands: seed, reset, create or drop');
  }
}

console.log('Ending the pg pool...');
await pool.end();
console.log('Done!');
