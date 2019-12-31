const express = require('express');
const axios = require('axios');
const HttpError = require('../models/http-error');
const _ = require('lodash');

const router = express.Router();

router.get('/:query', async (req, res, next) => {
    const query = req.params.query;

    let output = {};

    // GITHUB
    let response;
    try {
        response = await axios.get(`https://api.github.com/users/${query}`);
        if (response.data) {
            // output['github_user'] = response.data;
            output['github_user'] = _.pick(response.data, [
                'login',
                'id',
                'avatar_url',
                'html_url',
                'name',
                'bio',
                'created_at',
                'public_repos'
            ]);
        }
    } catch {
        // output['github_user'] = {};
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

            output['gitlab_user'] = {
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
    } catch {
        // output['gitlab_user'] = {};
    }

    // BITBUCKET
    let repoUrl;
    try {
        response = await axios.get(
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

            output['bitbucket_user'] = {
                id: uuid,
                login: nickname,
                avatar_url: links.avatar.href,
                html_url: links.html,
                name: display_name,
                created_at: created_on
            };
        }
    } catch {}
    if (output['bitbucket_user']) {
        try {
            response = await axios.get(repoUrl);
            numRepos = response.data.size;
            output['bitbucket_user']['public_repos'] = numRepos;
        } catch {
            output['bitbucket_user']['public_repos'] = 0;
        }
    }

    res.json({ searchResults: output, timestamp: Date.now() });
});

module.exports = router;
