const express = require('express');
const router = express.Router();
const folderController = require('../Controller/FolderController');
const authenticateToken = require('../Middleware/auth');

router.post('/', authenticateToken, folderController.createFolder);
router.get('/', folderController.getAllFolder);
router.get('/:id', authenticateToken, folderController.getFolderById);
router.delete('/:id', authenticateToken, folderController.deleteFolderById);

module.exports = router;