const assert = require("../../validations/assert")

module.exports = (req, res, next) => {
  assert(req.auth.role !== 'admin' && req.auth.role !== 'author', "Vous n'êtes ni admin ni auteur", 401)
  next();
};