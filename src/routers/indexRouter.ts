import type {
  // RequestHandler,
  Router as TypeRouter,
} from 'express';
import { Router } from 'express';
// import passport from 'passport';
import {
  getIndexPage,
  getSignupPage,
  getLoginPage,
  createUser,
  getJoinClub,
  postJoinClub,
  getLogout,
  postLoginPage,
  getMessageCreate,
  postMessageCreate,
  getBecomeAdmin,
  postBecomeAdmin,
  deleteMessage,
} from '../controllers/indexController.js';
import { CustomNotFoundError } from '../errors.js';
import { checkAdmin, checkAuth, checkUnauth } from '../authMiddleware.js';

const createIndexRouter = (): TypeRouter => {
  const indexRouter = Router();
  indexRouter.post('/message/delete', checkAdmin, deleteMessage);

  indexRouter.post('/message/create', checkAuth, postMessageCreate);
  indexRouter.get('/message/create', checkAuth, getMessageCreate);

  indexRouter.post('/become-admin', checkAuth, postBecomeAdmin);
  indexRouter.get('/become-admin', checkAuth, getBecomeAdmin);

  indexRouter.post('/join-club', checkAuth, postJoinClub);
  indexRouter.get('/join-club', checkAuth, getJoinClub);

  indexRouter.get('/log-out', checkAuth, getLogout);

  indexRouter.post('/log-in', checkUnauth, postLoginPage);
  indexRouter.get('/log-in', checkUnauth, getLoginPage);

  indexRouter.post('/sign-up', checkUnauth, createUser);
  indexRouter.get('/sign-up', checkUnauth, getSignupPage);

  indexRouter.get('/', getIndexPage);
  indexRouter.get('/*all', (_request, _response, next) => {
    next(new CustomNotFoundError('Page not found'));
  });

  return indexRouter;
};

export { createIndexRouter };
