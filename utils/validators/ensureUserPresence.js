const ValidationError = require("./validationError");

function ensureUserPresence(user) {
    if (!user) {
        throw new ValidationError("Aucun utilisateur n'a été trouvé");
    }
}

module.exports = ensureUserPresence;