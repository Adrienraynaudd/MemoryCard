const mongoose = require('mongoose');
const folderSchema = require('./Folder');

const utilisateurSchema = new mongoose.Schema({
    id: String,
    username: String,
    email: String,
    password: String,
    school: String,
    city: String,
    FavoriteFolder: [String] ,
}, { collection: 'CollectionUser' });

const User = mongoose.model('User', utilisateurSchema);

module.exports = User;
