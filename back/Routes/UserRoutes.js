const express = require('express');
const router = express.Router();
const userController = require('../Controller/UserController');
const authenticateToken = require('../Middleware/auth');

router.post('/', userController.createUser);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUserById);
router.delete('/:id', authenticateToken, userController.deleteUserById);
router.post('/login', userController.getUserByEmailAndPassword);

module.exports = router;