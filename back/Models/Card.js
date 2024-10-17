const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    id: String,
    question: String,
    response: String,
    userId: String,
    folderId: String

}, { collection: 'CollectionCard' });

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
