import { type NextFunction, type Request, type Response } from 'express';
import * as z from 'zod';
import { joinClubSchema, userCreationSchema } from '../schemas.js';
import { usersModel } from '../models/usersModel.js';
import { hashPassword, validatePassword } from '../libs/passwordUtilities.js';
import { UnauthorizedError } from '../errors.js';

const getIndexPage = (_request: Request, response: Response): void => {
  response.render('index', { title: 'Home' });
};

const getSignupPage = (_request: Request, response: Response): void => {
  response.render('sign-up', { title: 'Sign Up' });
};

const uniqueUserCreationSchema = userCreationSchema.superRefine(
  async ({ username }, context) => {
    const didUsernameExist = Boolean(
      await usersModel.getUserByUsername(username),
    );

    if (!didUsernameExist) return;

    context.addIssue({
      code: 'custom',
      message: 'The given username has already been used',
      path: ['username'],
    });
  },
);

const createUser = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const parseResult = await uniqueUserCreationSchema.safeParseAsync(
    request.body,
  );

  if (!parseResult.success) {
    response.status(400).render('sign-up', {
      title: 'Sign Up',
      errors: parseResult.error.issues,
    });
    return;
  }

  const { confirm_password, password, ...userData } = parseResult.data;

  const { id } = await usersModel.insertRow({
    ...userData,
    password: await hashPassword(password),
  });

  // @ts-expect-error Passport.js adds the rest of the properties
  request.login({ id }, (error) => {
    if (error) {
      next(error);
      return;
    }
    response.redirect('/');
  });
};

const getJoinClub = (_request: Request, response: Response): void => {
  response.render('join-club', { title: 'Join Club' });
};

const postJoinClub = async (
  request: Request,
  response: Response,
): Promise<void> => {
  if (!request.user) {
    throw new UnauthorizedError('You are not logged in!');
  }

  const parseResult = joinClubSchema.safeParse(request.body);

  if (!parseResult.success) {
    response.status(400).render('join-club', {
      title: 'Join Club',
      errors: parseResult.error.issues,
    });
    return;
  }

  await usersModel.editRowById(request.user.id, { is_member: true });
  response.redirect('/');
};

const loginSchema = z
  .object({
    username: z.string().trim().nonempty({ error: 'Username is required.' }),
    password: z.string().trim().nonempty({ error: 'Password is required.' }),
  })
  .superRefine(async ({ username, password }, context) => {
    if (username === '') return;

    const user = await usersModel.getUserByUsername(username.trim());

    if (!user) {
      context.addIssue({
        code: 'custom',
        message: 'The given username does not exist',
        path: ['username'],
      });

      return;
    }

    if (password === '') return;

    if (!(await validatePassword(password, user.password))) {
      context.addIssue({
        code: 'custom',
        message: 'Incorrect password!',
        path: ['password'],
      });
    }
  });

const postLoginPage = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const parseResults = await loginSchema.safeParseAsync(request.body);

  if (!parseResults.success) {
    response.status(400).render('log-in', {
      title: 'Log In',
      errors: parseResults.error.issues,
      givenBody: request.body as object,
    });
    return;
  }

  const user = await usersModel.getUserByUsername(parseResults.data.username);

  if (!user) throw new Error('User is invalid somehow');

  request.login(user, (error) => {
    if (error) {
      next(error);
      return;
    }
    response.redirect('/');
  });
};

const getLoginPage = (_request: Request, response: Response): void => {
  console.log(_request.session);
  response.render('log-in', { title: 'Log In' });
};

const getLogout = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  request.logout((error) => {
    if (error) {
      next(error);
      return;
    }
    response.redirect('/');
  });
};

export {
  getIndexPage,
  getSignupPage,
  createUser,
  getJoinClub,
  postJoinClub,
  getLoginPage,
  getLogout,
  postLoginPage,
};
