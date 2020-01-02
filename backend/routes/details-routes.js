const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const router = express.Router();

router.get('/github/:username', async (req, res, next) => {
    const username = req.params.username;
    let output;

    let response;
    try {
        response = await axios.get(
            `http://localhost:5000/api/search/github/${username}`
        );
        output = response.data.user;
        output['repos'] = [];

        response = await axios.get(
            `https://api.github.com/users/${username}/repos`
        );
        response.data.forEach(repo => {
            output['repos'].push(
                _.pick(repo, [
                    'name',
                    'html_url',
                    'description',
                    'created_at',
                    'updated_at',
                    'language',
                    'stargazers_count',
                    'forks_count'
                ])
            );
        });
        res.json({ details: output, timestamp: Date.now() });
    } catch {
        res.status(404).json({ message: 'Not Found', timestamp: Date.now() });
    }
});

router.get('/gitlab/:username', async (req, res, next) => {});

router.get('/bitbucket/:username', async (req, res, next) => {});

module.exports = router;
