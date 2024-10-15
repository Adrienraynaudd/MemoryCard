const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    question: String,
    response: String,
    userId: {userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }},
    folderId: {folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }}

}, { collection: 'CollectionCard' });

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
