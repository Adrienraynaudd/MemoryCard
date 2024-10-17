const jwt = require('jsonwebtoken');

const secretKey = 'TjPJIv2wnVUdflrb';

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Auth Error: Token missing' });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Auth Error: Token format invalid' });
    }

    // Vérifie le token JWT
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }

        req.user = user;
        next();
    });
};
