const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const noteController = require('../controllers/note.controller');

const router = Router();

// /api/note/notes
router.get('/notes', authMiddleware, noteController.getNotes);

// /api/note/createNote
router.post('/createNote', authMiddleware, noteController.createNote);

// /api/note/editNote
router.post('/editNote', authMiddleware, noteController.editNote);

// /api/note/deleteNote/:toDeleteId
router.delete('/deleteNote/:toDeleteId', authMiddleware, noteController.deleteNote);

module.exports = router;
