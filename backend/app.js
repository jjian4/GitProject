const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user-routes');
const searchRoutes = require('./routes/search-routes');
const detailsRoutes = require('./routes/details-routes');
const HttpError = require('./models/http-error.js');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use('/api/user', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/details', detailsRoutes);
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});
mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });
