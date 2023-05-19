const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const memoCardController = require('../controllers/memoCard.controller');

const router = Router();

// /api/memoCard/cards
router.get('/cards', authMiddleware, memoCardController.getCards);

// /api/memoCard/createCard
router.post('/createCard', authMiddleware, memoCardController.createCard);

// /api/memoCard/editCard
router.post('/editCard', authMiddleware, memoCardController.editCard);

// /api/memoCard/deleteCard
router.delete('/deleteCard', authMiddleware, memoCardController.deleteCard);

module.exports = router;
