const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    question: String,
    response: String,
    userId: {userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }}

}, { collection: 'CollectionCard' });

const User = mongoose.model('Card', cardSchema);

module.exports = User;
