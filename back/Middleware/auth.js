const jwt = require('jsonwebtoken');

const secretKey = 'TjPJIv2wnVUdflrb'; // récupère la clé secrète

module.exports = (req, res, next) => { // middleware pour vérifier le token
    const token = req.header('Authorization'); // récupère le token et prend la valeur située dans la partie Authorization du header

    if (!token) {
        return res.status(401).json({ message: 'Auth Error' }); // si le token est vide alors on renvoie une erreur
    }

    jwt.verify(token, secretKey, (err, user) => { // jwt vérifie si le token et la clé secrète sont corrects
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' }); // le token est invalide on renvoie une erreur
        }

        req.user = user; // s'il n'y a pas d'erreur et que le token est valide alors on récupère l'utilisateur
        next(); // on passe à autre chose
    }); // fermeture de la parenthèse manquante
};
