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
        'bitbucketUsername',
        'following'
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

router.get(
    '/:userId/following/:source/:followee',
    authCheck,
    async (req, res, next) => {
        const { userId, source, followee } = req.params;
        let existingUser;
        try {
            existingUser = await User.findOne({ _id: userId });
            if (!existingUser) {
                return next(new HttpError('Could not find user.', 500));
            }
        } catch (e) {
            return next(
                new HttpError("Could not update user's following list.", 500)
            );
        }

        res.json({
            isFollowed: !!_.find(existingUser.following, {
                source: source,
                username: followee
            })
        });
    }
);

router.patch('/:userId/following', authCheck, async (req, res, next) => {
    const userId = req.params.userId;
    const { source, followee } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ _id: userId });
        if (!existingUser) {
            return next(new HttpError('Could not find user.', 500));
        }

        if (
            !!_.find(existingUser.following, {
                source: source,
                username: followee
            })
        ) {
            await User.findOneAndUpdate(
                { _id: userId },
                { $push: { following: req.body } }
            );
        } else {
            await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { following: req.body } }
            );
        }
    } catch (e) {
        return next(
            new HttpError("Could not update user's following list.", 500)
        );
    }

    res.json({ message: 'update followingList successful' });
});

module.exports = router;
