const {assert} = require("../errorHandler")

function ensureUserPresence(user) {
    assert(!user, "Aucun utilisateur n'a été trouvé", 404)
}

module.exports = ensureUserPresence;