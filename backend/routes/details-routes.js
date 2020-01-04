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
            const newRepo = _.pick(repo, [
                'name',
                'html_url',
                'description',
                'created_at',
                'updated_at',
                'language',
                'stargazers_count',
                'forks_count'
            ]);
            if (newRepo['description'] === '') {
                newRepo['description'] = null;
            }
            if (!newRepo['language'] || newRepo['language'] === '') {
                newRepo['language'] = 'Unknown';
            }
            output['repos'].push(newRepo);
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

            let {
                name,
                web_url,
                description,
                created_at,
                last_activity_at,
                star_count,
                forks_count
            } = repo;

            if (description === '') {
                description = null;
            }

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
            const mostUsedLanguage =
                Object.keys(languageResponse.data)[0] || 'Unknown';
            output['repos'][index]['language'] = mostUsedLanguage;
        });

        output['repos'] = _.sortBy(output['repos'], 'updated_at').reverse();

        res.json({ details: output, timestamp: Date.now() });
    } catch {
        res.status(404).json({ message: 'Not Found', timestamp: Date.now() });
    }
});

router.get('/bitbucket/:username', async (req, res, next) => {
    const username = req.params.username;
    let output;

    let response;
    try {
        response = await axios.get(
            `http://localhost:5000/api/search/bitbucket/${username}`
        );
        output = response.data.user;
        output['repos'] = [];

        response = await axios.get(
            `https://api.bitbucket.org/2.0/users/${username}`
        );
        response = await axios.get(response.data.links.repositories.href);

        let starsPromises = [];
        let forksPromises = [];
        response.data.values.forEach(repo => {
            // Separately fetch stars and forks of each repo
            starsPromises.push(axios.get(repo.links.watchers.href));
            forksPromises.push(axios.get(repo.links.forks.href));

            let {
                name,
                links,
                description,
                created_on,
                updated_on,
                language
            } = repo;

            if (description === '') {
                description = undefined;
            }
            if (!language || language === '') {
                language = 'Unknown';
            }

            output['repos'].push({
                name,
                html_url: links.html.href,
                description,
                created_at: created_on,
                updated_at: updated_on
            });
        });

        const starsResponses = await Promise.all(starsPromises);
        starsResponses.forEach((starsResponse, index) => {
            output['repos'][index]['stargazers_count'] =
                starsResponse.data.size;
        });
        const forksResponses = await Promise.all(forksPromises);
        forksResponses.forEach((forksResponse, index) => {
            output['repos'][index]['forks_count'] = forksResponse.data.size;
        });

        output['repos'] = _.sortBy(output['repos'], 'updated_at').reverse();
        res.json({ details: output, timestamp: Date.now() });
    } catch {
        res.status(404).json({ message: 'Not Found', timestamp: Date.now() });
    }
});

module.exports = router;
