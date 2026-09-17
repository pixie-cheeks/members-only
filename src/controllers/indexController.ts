import { type NextFunction, type Request, type Response } from 'express';
import { joinClubSchema, userCreationSchema } from '../schemas.js';
import { usersModel } from '../models/usersModel.js';
import { hashPassword } from '../libs/passwordUtilities.js';
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

export { getIndexPage, getSignupPage, createUser, getJoinClub, postJoinClub };
