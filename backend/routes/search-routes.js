const express = require('express');
const axios = require('axios');
const HttpError = require('../models/http-error');

const router = express.Router();

router.get('/:query', async (req, res, next) => {
    const query = req.params.query;

    let output = {};

    let response;
    try {
        response = await axios.get('https://api.github.com/users/' + query);
        if (response.data) {
            output['github_user'] = response.data;
        }
        console.log(response);
    } catch {
        // output['github_user'] = {};
    }

    res.json({ searchResults: output, timestamp: Date.now() });
});

module.exports = router;
