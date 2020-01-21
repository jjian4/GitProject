const jwt = require('jwt');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if (req.methods == 'OPTIONS') {
        return next();
    }
    try {
        // Authorization Header: 'Bearer <Token>'
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next(new HttpError('Authentication failed', 401));
        }

        // Validates the token
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        // Pass along the user id so the next requests can use
        req.userData = { userId: decodedToken.userId };
        next();
    } catch {
        return next(new HttpError('Authentication failed', 401));
    }
};
