const express = require('express');
const axios = require('axios');
const User = require('../models/user');
const HttpError = require('../models/http-error.js');
const authCheck = require('../middleware/auth-check');
const _ = require('lodash');

const router = express.Router();

// router.use(authCheck);

router.get('/:userId', authCheck, async (req, res, next) => {
    // Will get info about logged in user
    const userId = req.params.userId;
    console.log(userId);

    res.json({ userId: userId, timestamp: Date.now() });
});

module.exports = router;
