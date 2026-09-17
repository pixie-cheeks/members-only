import type { Request, Response } from 'express';

const getIndexPage = (_request: Request, response: Response): void => {
  response.render('index', { title: 'Home' });
};

export { getIndexPage };
