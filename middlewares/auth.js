const jwt = require('jsonwebtoken');
const User = require('../models/users');

async function auth (req, res, next) {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN);
            const user = await User.findById(decodedToken.userId);
            setAuthInRequest(user, req)
        }
        next();
    } catch (error) {
        console.error(error);
        next();
    }
};

function setAuthInRequest(user, req) {
    if (user) {
        req.auth = {
            userId: user._id,
            role: user.role,
            pseudo: user.pseudo
        };
    } 
}

module.exports = auth;