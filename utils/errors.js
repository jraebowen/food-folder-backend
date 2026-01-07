export const ERROR_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER: {
    code: 500,
    message: "An error has occurred on the server.",
  },
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, ERROR_STATUS.BAD_REQUEST);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, ERROR_STATUS.NOT_FOUND);
  }
}
