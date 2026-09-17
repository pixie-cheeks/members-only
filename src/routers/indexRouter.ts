import type { Router as TypeRouter } from 'express';
import { Router } from 'express';
import {
  getIndexPage,
  getSignupPage,
  createUser,
  getJoinClub,
  postJoinClub,
} from '../controllers/indexController.js';
import { CustomNotFoundError } from '../errors.js';
import { checkAuth, checkUnauth } from '../authMiddleware.js';

const createIndexRouter = (): TypeRouter => {
  const indexRouter = Router();

  indexRouter.post('/join-club', checkAuth, postJoinClub);
  indexRouter.get('/join-club', checkAuth, getJoinClub);

  indexRouter.post('/sign-up', checkUnauth, createUser);
  indexRouter.get('/sign-up', checkUnauth, getSignupPage);

  indexRouter.get('/', getIndexPage);
  indexRouter.get('/*all', (_request, _response, next) => {
    next(new CustomNotFoundError('Page not found'));
  });

  return indexRouter;
};

export { createIndexRouter };
