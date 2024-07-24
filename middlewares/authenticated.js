module.exports = (req, res, next) => {
    if(req.auth) {
        next();
    } else {
        res.status(403).json({message: "unauthorized request" });
    }
};