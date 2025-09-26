const Favorite = require('../../../models/favorites');
const favoriteFactory = require("../../../factories/favoriteFactory")

async function createService(req, res) {
    const serviceId = req.body.serviceId;
    const userId = req.auth.userId;
    const existingFavoriteService = await Favorite.findOne({ userId, serviceId });
    await checkExistingFavoriteService(existingFavoriteService, userId, serviceId, res)
}

async function checkExistingFavoriteService(existingFavoriteService, userId, serviceId, res) {
    if (existingFavoriteService) {
        await Favorite.deleteOne({ _id: existingFavoriteService._id });
        return res.status(200).json({ message: "Votre service n'est plus dans la liste des favoris" });
    } else {
        const favorite = await favoriteFactory({ userId, serviceId});
        await favorite.save();
        return res.status(201).json({ message: 'Service ajouté dans la liste des favoris', favorite });
    }
}

module.exports = createService;