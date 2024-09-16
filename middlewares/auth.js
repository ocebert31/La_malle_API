const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN);
            const user = await User.findById(decodedToken.userId);
            if (user) {
                req.auth = {
                    userId: user._id,
                    role: user.role,
                    pseudo: user.pseudo
                };
            } 
        }
        next();
    } catch (error) {
        console.error(error);
        next();
    }
};
