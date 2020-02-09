const express = require('express');
const axios = require('axios');
const HttpError = require('../models/http-error');
const _ = require('lodash');

const router = express.Router();

router.get('/github/:query', async (req, res, next) => {
    const query = req.params.query;
    let output;
    try {
        const response = await axios.get(
            `https://api.github.com/users/${query}`
        );
        if (response.data) {
            output = _.pick(response.data, [
                'login',
                'id',
                'avatar_url',
                'html_url',
                'name',
                'bio',
                'created_at',
                'public_repos'
            ]);
            output['source'] = 'github';
        }
        res.json({ user: output, timestamp: Date.now() });
    } catch {
        res.status(404).json({ message: 'Not found', timestamp: Date.now() });
    }
});

router.get('/gitlab/:query', async (req, res, next) => {
    const query = req.params.query;
    let output;
    try {
        let response = await axios.get(
            `https://gitlab.com/api/v4/users?username=${query}`
        );
        const user_id = response.data[0].id;

        if (user_id) {
            response = await axios.get(
                `https://gitlab.com/api/v4/users/${user_id}`
            );
            const {
                id,
                name,
                username,
                avatar_url,
                web_url,
                created_at,
                bio
            } = response.data;

            response = await axios.get(
                `https://gitlab.com/api/v4/users/${user_id}/projects`
            );

            const numRepos = response.data.length;

            output = {
                source: 'gitlab',
                id,
                login: username,
                avatar_url,
                html_url: web_url,
                name,
                bio,
                created_at,
                public_repos: numRepos
            };
        }
        res.json({ user: output, timestamp: Date.now() });
    } catch {
        res.status(404).json({ message: 'Not found', timestamp: Date.now() });
    }
});

router.get('/bitbucket/:query', async (req, res, next) => {
    const query = req.params.query;
    let output;
    let repoUrl;
    try {
        let response = await axios.get(
            `https://api.bitbucket.org/2.0/users/${query}`
        );
        if (response.data) {
            const {
                display_name,
                uuid,
                links,
                created_on,
                nickname
            } = response.data;

            repoUrl = links.repositories.href;

            output = {
                source: 'bitbucket',
                id: uuid,
                login: nickname,
                avatar_url: links.avatar.href,
                html_url: links.html.href,
                name: display_name,
                created_at: created_on
            };
        }
    } catch {
        res.status(404).json({ message: 'Not found', timestamp: Date.now() });
    }
    if (output) {
        try {
            response = await axios.get(repoUrl);
            numRepos = response.data.size;
            output['public_repos'] = numRepos;
        } catch {
            output['public_repos'] = 0;
        }

        res.json({ user: output, timestamp: Date.now() });
    }
});

router.get('/:query', async (req, res, next) => {
    const query = req.params.query;

    let output = [];

    // GITHUB
    let response;
    try {
        response = await axios.get(
            `http://localhost:5000/api/search/github/${query}`
        );
        if (response.data.user) {
            output.push(response.data.user);
        }
    } catch {}

    // GITLAB
    try {
        response = await axios.get(
            `http://localhost:5000/api/search/gitlab/${query}`
        );
        if (response.data.user) {
            output.push(response.data.user);
        }
    } catch {}

    // BITBUCKET
    try {
        response = await axios.get(
            `http://localhost:5000/api/search/bitbucket/${query}`
        );
        if (response.data.user) {
            output.push(response.data.user);
        }
    } catch {}

    output = _.sortBy(output, ['public_repos', 'created_at']).reverse();

    res.json({ searchResults: output, timestamp: Date.now() });
});

module.exports = router;
