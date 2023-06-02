const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const memoPackController = require('../controllers/memoPack.controller');

const router = Router();

// /api/memoPack/memoPacks
router.get('/memoPacks', authMiddleware, memoPackController.getMemoPacks);

// /api/memoPack/createMemoPack
router.post('/createMemoPack', authMiddleware, memoPackController.createMemoPack);

// /api/memoPack/editMemoPack
router.post('/editMemoPack', authMiddleware, memoPackController.editMemoPack);

// /api/memoPack/deleteMemoPack/:toDeleteId
router.delete('/deleteMemoPack/:toDeleteId', authMiddleware, memoPackController.deleteMemoPack);

module.exports = router;
