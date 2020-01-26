const express = require('express');
const User = require('../models/user');
const HttpError = require('../models/http-error.js');
const authCheck = require('../middleware/auth-check');

const router = express.Router();

router.get('/:userId', authCheck, async (req, res, next) => {
    let existingUser;
    try {
        existingUser = await User.findOne({ _id: userId });
        if (!existingUser) {
            return next(new HttpError('Could not get user info 1.', 500));
        }
    } catch (e) {
        return next(new HttpError('Could not get user info 2.', 500));
    }

    const { name, email, password } = existingUser;

    res.json({ name, email, password });
});

module.exports = router;
