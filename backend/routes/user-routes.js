const express = require('express');
const User = require('../models/user');
const HttpError = require('../models/http-error.js');
const authCheck = require('../middleware/auth-check');
const _ = require('lodash');

const router = express.Router();

router.get('/:userId', authCheck, async (req, res, next) => {
    const userId = req.params.userId;
    let existingUser;
    try {
        existingUser = await User.findOne({ _id: userId });
        if (!existingUser) {
            return next(new HttpError('Could not get user info 1.', 500));
        }
    } catch (e) {
        return next(new HttpError('Could not get user info 2.', 500));
    }

    const userInfo = _.pick(existingUser, [
        'name',
        'email',
        'githubUsername',
        'gitlabUsername',
        'bitbucketUsername'
    ]);

    res.json(userInfo);
});

router.patch('/:userId', authCheck, async (req, res, next) => {
    const userId = req.params.userId;
    let existingUser;
    try {
        existingUser = await User.findOneAndUpdate({ _id: userId }, req.body, {
            useFindAndModify: false
        });
        if (!existingUser) {
            return next(new HttpError('Could not find user.', 500));
        }
    } catch (e) {
        return next(new HttpError('Could not update user.', 500));
    }

    res.json({ message: 'update successful' });
});

module.exports = router;
