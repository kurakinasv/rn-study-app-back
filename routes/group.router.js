const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const groupController = require('../controllers/group.controller');

const router = Router();

// /api/group/groups
router.get('/groups', authMiddleware, groupController.getGroups);

// /api/group/createGroup
router.post('/createGroup', authMiddleware, groupController.createGroup);

// /api/group/editGroup
router.post('/editGroup', authMiddleware, groupController.editGroup);

// /api/group/deleteGroup/:toDeleteId
router.delete('/deleteGroup/:toDeleteId', authMiddleware, groupController.deleteGroup);

module.exports = router;
