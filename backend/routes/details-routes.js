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

        output['repos'] = _.sortBy(output['repos'], 'updated_at').reverse();
        res.json({ details: output, timestamp: Date.now() });
    } catch {
        res.status(404).json({ message: 'Not Found', timestamp: Date.now() });
    }
});

router.get('/gitlab/:username', async (req, res, next) => {
    const username = req.params.username;
    let output;

    let response;
    try {
        response = await axios.get(
            `http://localhost:5000/api/search/gitlab/${username}`
        );
        output = response.data.user;
        output['repos'] = [];

        response = await axios.get(
            `https://gitlab.com/api/v4/users/${output.id}/projects`
        );
        let languagePromises = [];
        response.data.forEach(repo => {
            // Separately fetch language of each repo
            languagePromises.push(
                axios.get(
                    `https://gitlab.com/api/v4/projects/${repo.id}/languages`
                )
            );

            const {
                name,
                web_url,
                description,
                created_at,
                last_activity_at,
                star_count,
                forks_count
            } = repo;

            output['repos'].push({
                name,
                html_url: web_url,
                description,
                created_at,
                updated_at: last_activity_at,
                stargazers_count: star_count,
                forks_count
            });
        });

        const languageResponses = await Promise.all(languagePromises);
        languageResponses.forEach((languageResponse, index) => {
            const mostUsedLanguage = Object.keys(languageResponse.data)[0];
            output['repos'][index]['language'] = mostUsedLanguage;
        });

        output['repos'] = _.sortBy(output['repos'], 'updated_at').reverse();
        res.json({ details: output, timestamp: Date.now() });
    } catch {
        res.status(404).json({ message: 'Not Found', timestamp: Date.now() });
    }
});

router.get('/bitbucket/:username', async (req, res, next) => {});

module.exports = router;
