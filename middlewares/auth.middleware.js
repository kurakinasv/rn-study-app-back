const jwt = require('jsonwebtoken');

const ApiError = require('./error/ApiError');

const authMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next;
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      next(ApiError.unauthorized('Нет авторизации'));
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = userId;

    next();
  } catch (e) {
    next(ApiError.unauthorized('Нет авторизации'));
  }
};

module.exports = authMiddleware;
