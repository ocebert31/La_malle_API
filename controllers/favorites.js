const Favorite = require('../models/favorites');

exports.createFavoriteService = async (req, res) => {
    const serviceId = req.body.serviceId;
    const userId = req.auth.userId;
    try {
        const existingFavoriteService = await Favorite.findOne({ userId, serviceId });
        await checkExistingFavoriteService(existingFavoriteService, userId, serviceId, res)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};

async function checkExistingFavoriteService(existingFavoriteService, userId, serviceId, res) {
    if (existingFavoriteService) {
        await Favorite.deleteOne({ _id: existingFavoriteService._id });
        handleExistingFavoriteService(existingFavoriteService, userId, serviceId, res);
    } else {
        const favorite = new Favorite({ userId, serviceId});
        await favorite.save();
        return res.status(201).json({ message: 'Service ajouté dans la liste des favoris', favorite });
    }
}

async function handleExistingFavoriteService(existingFavoriteService, userId, serviceId, res) {
    if (existingFavoriteService.serviceId.toString() === serviceId && existingFavoriteService.userId.toString() === userId.toString()) {
        return res.status(200).json({ message: "Votre service n'est plus dans la liste des favoris" });
    } else {
        const favorite = new Favorite({ userId, serviceId });
        await favorite.save();
        return res.status(200).json({ message: 'Votre service est dans la liste des favoris', favorite });
    }
}