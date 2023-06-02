const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const ApiError = require('../middlewares/error/ApiError');
const User = require('../models/User');

class AuthController {
  // GET /api/auth/user
  getUser = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });
      res.status(200).json(user);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при получении данных пользователя'));
    }
  };

  // POST /api/auth/login
  login = async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMsgs = errors
          .array()
          .map(({ msg }) => msg)
          .join(', ');

        return next(ApiError.badRequest(`Некорректные данные: ${errorMsgs}`));
      }

      const { email, password } = req.body;

      if (typeof email !== 'string' || typeof password !== 'string') {
        return next(ApiError.badRequest('Некорректные данные для входа'));
      }

      if (!email.trim() || !password.trim()) {
        return next(ApiError.badRequest('Не заполнены все обязательные поля'));
      }

      const foundUser = await User.findOne({ email });

      if (!foundUser) {
        return next(ApiError.badRequest('Пользователь не найден'));
      }

      const arePasswordsMatch = await bcrypt.compare(password, foundUser.password);

      if (!arePasswordsMatch) {
        return next(ApiError.badRequest('Некорректные данные для входа'));
      }

      const token = this._createToken(foundUser.id);

      res.json({ userId: foundUser.id, token });
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  };

  // POST /api/auth/register
  register = async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMsgs = errors
          .array()
          .map(({ msg }) => msg)
          .join(', ');

        return next(ApiError.badRequest(`Некорректные данные: ${errorMsgs}`));
      }

      const { email, password, username, notes, memoPacks, groups } = req.body;

      if (typeof email !== 'string' || typeof password !== 'string') {
        return next(ApiError.badRequest('Некорректные данные для входа'));
      }

      if (!email.trim() || !password.trim()) {
        return next(ApiError.badRequest('Не заполнены все обязательные поля'));
      }

      const isExist = await User.findOne({ email });

      if (isExist) {
        return next(ApiError.badRequest('Такой пользователь уже существует'));
      }

      const hash = await bcrypt.hash(password, 4);

      const notesToAdd = !!notes ? notes : [];
      const memoPacksToAdd = !!memoPacks ? memoPacks : [];
      const groupsToAdd = !!groups ? groups : [];

      const user = await User.create({
        email,
        password: hash,
        username,
        notes: notesToAdd,
        memoPacks: memoPacksToAdd,
        groups: groupsToAdd,
      });

      await user.save();

      const token = this._createToken(user.id);

      res.status(200).json({ message: 'Пользователь создан', user, token });
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  };

  // POST /api/auth/user
  editUser = async (req, res, next) => {
    try {
      const { username } = req.body;

      const user = await User.findOne({ _id: req.userId });

      if (!user) {
        return next(ApiError.notFound('Пользователь не найден'));
      }

      user.username = username.trim();

      await user.save();

      res.status(200).json(user);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при изменении данных пользователя'));
    }
  };

  _createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET);
  };
}

module.exports = new AuthController();
