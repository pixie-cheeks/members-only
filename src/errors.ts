/* eslint-disable max-classes-per-file */
import type { NextFunction, Request, Response } from 'express';

class CustomError extends Error {
  statusCode: number;
  name: string;

  constructor(message: string, statusCode: number, name: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
  }
}

class CustomNotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404, 'NotFoundError');
  }
}

class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 401, 'UnauthorizedError');
  }
}

const errorHandler = (
  error: CustomError | Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  console.error(error);
  if (error instanceof CustomError) {
    response.status(error.statusCode).render('index', {
      title: `Error ${error.statusCode}`,
      error,
    });
  } else {
    const serverErrorCode = 500;
    response.status(serverErrorCode).render('index', {
      title: `Error ${serverErrorCode}r`,
      error: {
        statusCode: serverErrorCode,
        message: 'The server encountered an error.',
      },
    });
  }
};

export { CustomNotFoundError, UnauthorizedError, errorHandler };
