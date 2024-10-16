const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    id: String,
    title: String,
    question: String,
    isFavorite: Boolean,
    tags: [String],
    userId: String
}, { collection: 'CollectionFolder' });

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
