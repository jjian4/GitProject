const express = require('express');
const axios = require('axios');
const User = require('../models/user');
const HttpError = require('../models/http-error.js');
const _ = require('lodash');

const router = express.Router();

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(
            new HttpError('Loggin in failed, please try again later.', 500)
        );
    }

    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError('Invalid credentials. Cannot log in.', 401));
    }

    res.json({
        message: 'Logged in',
        user: existingUser.toObject({ getters: true })
    });
});

router.post('/register', async (req, res, next) => {
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
});

module.exports = router;
