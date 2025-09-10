const User = require('../../models/users');
const {assert} = require('../errorHandler')

async function checkExistingUser(email) {
    const existingUser = await User.findOne({
        $or: [
            { email: email },
            { newEmail: email }
        ]
    });
    assert(existingUser, "Cet email est déjà utilisé", 400)
}

module.exports = checkExistingUser;