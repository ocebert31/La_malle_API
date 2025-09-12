const createService = require("../services/command/favorite/createService")

exports.createFavoriteService = async (req, res) => {
    await createService(req, res);
};

