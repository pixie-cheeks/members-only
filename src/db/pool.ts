import type { PoolConfig } from 'pg';
import { Pool } from 'pg';
import { getConnectionString } from './aivenControl.js';
import { parsedEnvironment } from '../settings/parsedEnvironment.js';

const getConfig = async (): Promise<PoolConfig> =>
  parsedEnvironment.DB_ENV === 'prod'
    ? {
        connectionString: await getConnectionString(),
        ssl: {
          rejectUnauthorized: true,
          ca: parsedEnvironment.DB_SSL_CA,
        },
      }
    : { connectionString: parsedEnvironment.CONNECTION_STRING };

const pool = new Pool(await getConfig());

export { pool };
