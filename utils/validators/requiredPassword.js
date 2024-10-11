const ValidationError = require("./validationError");

function requiredPassword(password) {
    if (!password || password.trim() === '') {
        throw new ValidationError("Le mot de passe est requis" );
    }
}

module.exports = requiredPassword;