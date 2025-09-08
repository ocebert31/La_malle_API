module.exports = (req, res, next) => {
  if (req.auth.role !== 'admin') {
    return res.status(403).json({ message: "Vous n'êtes pas admin" });
  }
  next();
};