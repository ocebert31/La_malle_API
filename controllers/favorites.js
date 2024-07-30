const Favorite = require('../models/favorites');

exports.createFavorite = async (req, res) => {
    const articleId = req.body.articleId;
    const userId = req.auth.userId;
    try {
        const existingFavoriteArticle = await Favorite.findOne({ userId, articleId });

        if (existingFavoriteArticle) {
            await Favorite.deleteOne({ _id: existingFavoriteArticle._id });
            if (existingFavoriteArticle.articleId.toString() === articleId && existingFavoriteArticle.userId.toString() === userId) {
                return res.status(200).json({ message: "Votre article n'est plus dans la liste des favoris" });
            } else {
                const favorite = new Favorite({ userId, articleId });
                await favorite.save();
                return res.status(200).json({ message: 'Votre article est dans la liste des favoris', favorite });
            }
        } else {
            const favorite = new Favorite({ userId, articleId});
            await favorite.save();
            return res.status(201).json({ message: 'Article ajouté dans la liste des favoris', favorite });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};