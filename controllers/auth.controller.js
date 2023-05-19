const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const ApiError = require('../middlewares/error/ApiError');
const User = require('../models/user');

class AuthController {
  // POST /api/auth/login
  login = async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        next(ApiError.badRequest(`Некорректные данные: ${errors.array()}`));
      }

      const { email, password } = req.body;

      if (typeof email !== 'string' || typeof password !== 'string') {
        next(ApiError.badRequest('Некорректные данные для входа'));
      }

      if (!email.trim() || !password.trim()) {
        next(ApiError.badRequest('Не заполнены все обязательные поля'));
      }

      const foundUser = await User.findOne({ email });

      if (!foundUser) {
        next(ApiError.badRequest('Пользователь не найден'));
      }

      const arePasswordsMatch = await bcrypt.compare(password, foundUser.password);

      if (!arePasswordsMatch) {
        next(ApiError.badRequest('Некорректные данные для входа'));
      }

      const token = this._createToken(foundUser.id);

      res.json({ userId: foundUser.id, token });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  };

  // POST /api/auth/register
  register = async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        next(ApiError.badRequest(`Некорректные данные: ${errors.array()}`));
      }

      const { email, password, username } = req.body;

      if (typeof email !== 'string' || typeof password !== 'string') {
        next(ApiError.badRequest('Некорректные данные для входа'));
      }

      if (!email.trim() || !password.trim()) {
        next(ApiError.badRequest('Не заполнены все обязательные поля'));
      }

      const isExist = await User.findOne({ email });

      if (isExist) {
        next(ApiError.badRequest('Такой пользователь уже существует'));
      }

      const hash = await bcrypt.hash(password, 27);

      const un = username ? username : undefined;
      const user = await User.create({ email, password: hash, username: un });

      await user.save();

      const token = this._createToken(user.id, is_admin);

      res.json(`Пользователь создан:\n${user}\n${token}`);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  };

  _createToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    return token;
  };
}

module.exports = new AuthController();
