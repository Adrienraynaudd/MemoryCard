const express = require('express');
const router = express.Router();
const folderController = require('../Controller/FolderController');
const authenticateToken = require('../Middleware/auth');

router.post('/', folderController.createFolder);
router.get('/', folderController.getAllFolder);
router.get('/:id', authenticateToken, folderController.getFolderById);
router.get('/user/:id', authenticateToken, folderController.getFoldersByUserId);
router.delete('/:id', authenticateToken, folderController.deleteFolderById);

module.exports = router;