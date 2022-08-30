/* eslint-disable max-classes-per-file */

class ApplicationError extends Error {
  constructor(status = 500, message = 'Что-то пошло не так!') {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends ApplicationError {
  constructor(message = 'Поиск документа по ID не дал результатов') {
    super(404, message);
  }
}

class LoginError extends ApplicationError {
  constructor(message = 'Неверный логин или пароль') {
    super(401, message);
  }
}

class ValidationError extends ApplicationError {
  constructor(message = 'Неверный логин или пароль') {
    super(400, message);
  }
}

class ForbiddenError extends ApplicationError {
  constructor(message = 'Вы не можете удалить чужую карточку') {
    super(403, message);
  }
}

function handleError(err, req, res, next) {
  const { name, message, code = 0 } = err;
  let { status = 500 } = err;
  if (name === 'CastError' || name === 'ValidationError') {
    status = 400;
  } else if (code === 11000) {
    status = 409;
  }

  res.status(status).send({ message: `${name}: ${message}` });

  next();
}

module.exports = {
  NotFoundError,
  LoginError,
  ValidationError,
  ForbiddenError,
  handleError,
};
