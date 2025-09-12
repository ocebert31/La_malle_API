const { assert } = require("../errorHandler")

function isAuthorOfCreationOrAdmin(service, auth) {
  assert(service.userId.toString() !== auth.userId.toString() && auth.role !== 'admin', "Seul l'auteur de cette création ou l'admin ont ce droit d'accès", 401)
}

module.exports = isAuthorOfCreationOrAdmin;