const { assert } = require("../utils/errorHandler")

module.exports = (req, res, next) => {
    assert(!req.auth, "Demande non autorisée", 401)
    next()
};