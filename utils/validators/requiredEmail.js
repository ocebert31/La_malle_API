const ValidationError = require("./validationError");

function requiredEmail(email) {
    if (!email || email.trim() === '') {
        throw new ValidationError("L'email est requis." );
    }
}

module.exports = requiredEmail;