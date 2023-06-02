const { Router } = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// /api/auth/user
router.get('/user', authMiddleware, authController.getUser);

// /api/auth/editUser
router.post('/editUser', authMiddleware, authController.editUser);

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Некорректный email').normalizeEmail().isEmail(),
    check('password', 'Не введен пароль').exists(),
  ],
  authController.login
);

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля – 7 символов').isLength({ min: 7 }),
  ],
  authController.register
);

module.exports = router;
