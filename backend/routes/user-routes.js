const express = require('express');
const axios = require('axios');
const { check } = require('express-validator');
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

        // TODO
        // Check if existing user with same email exists
        // Setup DB and make User model (in separate file)
        // Make new instance of User and save
        // Return 201 and created user to frontend
    }
);

module.exports = router;
