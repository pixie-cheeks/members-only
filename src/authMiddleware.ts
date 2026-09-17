import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from './errors.js';

const checkUnauth = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  if (request.isUnauthenticated()) {
    next();
    return;
  }

  response.redirect('/');
};

const checkAuth = (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  if (request.isAuthenticated()) {
    next();
    return;
  }

  throw new UnauthorizedError('No access. You need to log in!');
};

const checkMember = (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  if (request.isAuthenticated() && request.user.is_member) {
    next();
    return;
  }

  throw new UnauthorizedError(
    "You don't have the required privileges to access this page!",
  );
};

const checkAdmin = (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  if (request.isAuthenticated() && request.user.is_admin) {
    next();
    return;
  }

  throw new UnauthorizedError(
    "You don't have the required privileges to access this page!",
  );
};

export { checkAuth, checkAdmin, checkMember, checkUnauth };
