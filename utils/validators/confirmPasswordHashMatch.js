const bcrypt = require('bcrypt');
const {assert} = require("../errorHandler")

async function confirmPasswordHashMatch(password, user) {
    const isMatch = await bcrypt.compare(password, user.password); 
    assert(!isMatch, "Mot de passe incorrect.", 401)
}

module.exports = confirmPasswordHashMatch;