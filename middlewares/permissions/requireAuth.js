const assert = require("../../validations/assert")

module.exports = (req, res, next) => {
    assert(!req.auth, "Demande non autorisée", 401)
    next()
};