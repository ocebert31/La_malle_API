const assert = require("../../validations/assert")

module.exports = (req, res, next) => {
  assert(req.auth.role !== 'admin', "Vous n'êtes pas admin", 401)
  next();
};