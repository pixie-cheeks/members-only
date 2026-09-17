import { type NextFunction, type Request, type Response } from 'express';
import { userCreationSchema } from '../schemas.js';
import { usersModel } from '../models/usersModel.js';
import { hashPassword } from '../libs/passwordUtilities.js';

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

  const { id: userId } = await usersModel.insertRow({
    ...userData,
    password: await hashPassword(password),
  });

  request.login(
    { password, username: userData.username, id: userId },
    (error) => {
      if (error) {
        next(error);
        return;
      }
      response.redirect('/');
    },
  );
};

export { getIndexPage, getSignupPage, createUser };
