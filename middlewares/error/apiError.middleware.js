const ApiError = require('./ApiError.js');

const errorMiddleware = (err, req, res, next) => {
  const { status, message } = err;

  if (err instanceof ApiError) {
    return res.status(status).json({ message });
  }

  return res.status(500).json({ message: 'Что-то пошло не так :(' });
};

module.exports = errorMiddleware;
