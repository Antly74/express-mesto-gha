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

function handleError(error, res) {
  switch (error.name) {
    case 'NotFoundError':
      res.status(error.status).send({ message: `${error.name}: ${error.message}` });
      break;
    case 'ValidationError':
      res.status(400).send({ message: `${error.name}: ${error.message}` });
      break;
    default:
      res.status(500).send({ message: `${error.name}: ${error.message}` });
      break;
  }
}

module.exports = { NotFoundError, handleError };