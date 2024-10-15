const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    question: String,
    tags: [String],
    isFavorite: Boolean,
    userId: {userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }}
}, { collection: 'CollectionFolder' });

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
