const ValidationError = require("./validationError");

function passwordTooShort(password) {
    if (password.length < 6) {
        throw new ValidationError("Le mot de passe doit comporter au moins 6 caractères");
    }
}

module.exports = passwordTooShort;