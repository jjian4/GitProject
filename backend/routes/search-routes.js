const express = require('express');
const axios = require('axios');
const HttpError = require('../models/http-error');

const router = express.Router();

router.get('/:query', async (req, res, next) => {
    const query = req.params.query;

    let output = {};

    // GITHUB
    let response;
    try {
        response = await axios.get(`https://api.github.com/users/${query}`);
        if (response.data) {
            output['github_user'] = response.data;
        }
    } catch {
        output['github_user'] = {};
    }

    // GITLAB
    try {
        response = await axios.get(
            `https://gitlab.com/api/v4/users?username=${query}`
        );
        const user_id = response.data[0].id;

        if (user_id) {
            response = await axios.get(
                `https://gitlab.com/api/v4/users/${user_id}`
            );
            output['gitlab_user'] = response.data;
        }
    } catch {
        output['gitlab_user'] = {};
    }

    res.json({ searchResults: output, timestamp: Date.now() });
});

module.exports = router;
