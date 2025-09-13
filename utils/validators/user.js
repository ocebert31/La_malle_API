const User = require('../../models/users');
const assert = require('../../validations/assert')
const bcrypt = require('bcrypt');

async function checkExistingUser(email) {
    const existingUser = await User.findOne({
        $or: [
            { email: email },
            { newEmail: email }
        ]
    });
    assert(existingUser, "Cet email est déjà utilisé", 400)
}

async function confirmPasswordHashMatch(password, user) {
    const isMatch = await bcrypt.compare(password, user.password); 
    assert(!isMatch, "Mot de passe incorrect.", 401)
}

module.exports = { checkExistingUser, confirmPasswordHashMatch };
