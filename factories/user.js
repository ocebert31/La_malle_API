const crypto = require('crypto');
const User = require('../models/users');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const secureHash = require("../utils/security/secureHash");

async function userBuilder(password, email) {
    const pseudo = uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals],
        length: 3,
        separator: '_'
    });
    const confirmationToken = crypto.randomBytes(20).toString('hex');
    const hashedPassword = await secureHash(password);
    const user = new User({
        newEmail: email,
        password: hashedPassword,
        pseudo: pseudo,
        confirmationToken,
    });
    return user;
}

module.exports = userBuilder;