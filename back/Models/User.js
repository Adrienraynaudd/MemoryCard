const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    school: String,
    city: String,
}, { collection: 'CollectionUser' });

const User = mongoose.model('User', utilisateurSchema);

module.exports = User;
