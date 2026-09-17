/* eslint-disable unicorn/no-null */
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import type { Express } from 'express';
import { pool } from '../db/pool.js';
import { usersModel, type UserType } from '../models/usersModel.js';
import { validatePassword } from '../libs/passwordUtilities.js';

const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await usersModel.getUserByUsername(username.trim());

    if (!user) {
      done(null, false);
      return;
    }

    if (!(await validatePassword(password.trim(), user.password))) {
      done(null, false);
      return;
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});

const setupPassport = (app: Express): void => {
  app.use(passport.session());

  passport.use(strategy);

  passport.serializeUser((user: { id?: number }, done) => {
    if (!user.id) throw new Error('User ID not found in passport.');
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query<UserType>(
        'SELECT * FROM users WHERE id = $1',
        [id],
      );
      const user = rows.at(0);

      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export { setupPassport };
