const ValidationError = require("./validationError");

function confirmPasswordMatch(password, confirmPassword) {
    if (password !== confirmPassword) {
        throw new ValidationError("Les mots de passe doivent correspondre");
    }
}

module.exports = confirmPasswordMatch;