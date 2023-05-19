const { model } = require('mongoose');

const userSchema = require('./schemas/user.schema');

module.exports = model('User', userSchema);
