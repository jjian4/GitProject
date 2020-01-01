const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const router = express.Router();

router.get('/github/:username', async (req, res, next) => {
    const username = req.params.username;
    let output = {
        source: 'github',
        login: username
    };

    let response;
    try {
        response = await axios.get(`https://api.github.com/users/${query}`);
        if (response) {
            console.log(response.data);
        }
    } catch {}

    res.json({ details: output, timestamp: Date.now() });
});

router.get('/gitlab/:username', async (req, res, next) => {});

router.get('/bitbucket/:username', async (req, res, next) => {});

module.exports = router;
