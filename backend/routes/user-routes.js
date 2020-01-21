const express = require('express');
const axios = require('axios');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const HttpError = require('../models/http-error.js');
const _ = require('lodash');

const router = express.Router();

router.post(
    '/register',
    [
        check('name')
            .not()
            .isEmpty(),
        check('email')
            .not()
            .isEmpty(),
        check('password').isLength({ min: 6 })
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(
                new HttpError(
                    'Invalid inputs passed, please check your data.',
                    422
                )
            );
        }

        const { name, email, password } = req.body;

        let existingUser;
        try {
            existingUser = await User.findOne({ email: email });
        } catch (err) {
            return next(
                new HttpError('Signing up failed, please try again later.', 500)
            );
        }
        if (existingUser) {
            return next(
                new HttpError('User exists already, please login instead.', 422)
            );
        }

        const createdUser = new User({
            name,
            email,
            password
        });

        try {
            await createdUser.save();
        } catch (err) {
            return next(
                new HttpError('Signing up failed, please try again later.', 500)
            );
        }

        res.status(201).json({ user: createdUser.toObject({ getters: true }) });
    }
);

module.exports = router;
