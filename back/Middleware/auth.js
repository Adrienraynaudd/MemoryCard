const jwt = require('jsonwebtoken');

const secretKey = 'TjPJIv2wnVUdflrb';

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Auth Error' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }

        req.user = user;
        next();
    });
};
