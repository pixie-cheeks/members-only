import type { NextFunction, Request, Response } from 'express';

class CustomNotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

const errorHandler = (
  error: CustomNotFoundError | Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  console.error(error);
  if (error instanceof CustomNotFoundError) {
    response.status(error.statusCode).render('main', {
      title: `Error ${error.statusCode}`,
      error,
      componentName: 'error',
    });
  } else {
    const serverErrorCode = 500;
    response.status(serverErrorCode).render('main', {
      title: `Error ${serverErrorCode}r`,
      error: {
        statusCode: serverErrorCode,
        message: 'The server encountered an error.',
      },
      componentName: 'error',
    });
  }
};

export { CustomNotFoundError, errorHandler };
