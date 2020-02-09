const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true, minlength: 1 },
    email: { type: String, required: true, unique: true, minlength: 1 },
    password: { type: String, required: true, minlength: 6 },
    githubUsername: { type: String, default: '' },
    gitlabUsername: { type: String, default: '' },
    bitbucketUsername: { type: String, default: '' },
    following: { type: Array, default: [] }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
