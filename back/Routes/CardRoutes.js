const express = require('express');
const router = express.Router();
const cardController = require('../Controller/CardController');
const authenticateToken = require('../Middleware/auth');

router.post('/', authenticateToken, cardController.createCard);
router.get('/', authenticateToken, cardController.getAllCards);
router.get('/:id', authenticateToken, cardController.getCardById);
router.put('/:id', authenticateToken, cardController.updateCardById);
router.delete('/:id', authenticateToken, cardController.deleteCardById);

module.exports = router;