const multer = require('multer');

const errorHandler = (error, req, res ,next) => {
    if (error instanceof multer.MulterError) {
        console.error(error)
        res.status(500).json({message: "Erreur lors du téléversement de l'image."});
    } else if (error) {
        console.error(error)
        res.status(500).json({message: "Erreur technique, veuillez réessayer plus tard."});
    } else {
        next();
    }
}

module.exports = errorHandler;