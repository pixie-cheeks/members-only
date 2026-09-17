import type { Router as TypeRouter } from 'express';
import { Router } from 'express';
import {
  getIndexPage,
  getSignupPage,
  createUser,
} from '../controllers/indexController.js';
import { CustomNotFoundError } from '../errors.js';

const createIndexRouter = (): TypeRouter => {
  const indexRouter = Router();

  indexRouter.post('/sign-up', createUser);
  indexRouter.get('/sign-up', getSignupPage);
  indexRouter.get('/', getIndexPage);
  indexRouter.get('/*all', (_request, _response, next) => {
    next(new CustomNotFoundError('Page not found'));
  });

  return indexRouter;
};

export { createIndexRouter };
