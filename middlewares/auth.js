const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
        if(req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN);
            req.auth = {
                userId: decodedToken.userId,
                role: decodedToken.role,
                pseudo: decodedToken.pseudo
            };
        }
        next();
   } catch(error) {
        console.error(error);
        next();
   }
};