const ValidationError = require("./validationError");
const bcrypt = require('bcrypt');

async function confirmPasswordHashMatch(password, user) {
    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) {
        throw new ValidationError("Mot de passe incorrect.");
    }
}

module.exports = confirmPasswordHashMatch;