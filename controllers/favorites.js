const favoriteService = require("../services/favorite")

exports.createFavoriteService = async (req, res) => {
    await favoriteService.createFavoriteService(req, res);
};

