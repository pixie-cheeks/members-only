import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import type { Express } from 'express';
import { pool } from '../db/pool.js';
import { parsedEnvironment } from './parsedEnvironment.js';

const PGStore = connectPgSimple(session);
const sessionStore = new PGStore({
  pool,
  createTableIfMissing: true,
  tableName: 'sessions',
});

export const setupSessionStore = (app: Express): void => {
  app.use(
    session({
      secret: parsedEnvironment.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
      cookie: {
        maxAge: 1_000 * 60 * 60 * 24, // 1 day or 24 hours
      },
    }),
  );
};
