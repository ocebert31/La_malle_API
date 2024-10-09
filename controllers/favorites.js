const Favorite = require('../models/favorites');

exports.createFavorite = async (req, res) => {
    const articleId = req.body.articleId;
    const userId = req.auth.userId;
    try {
        const existingFavoriteArticle = await Favorite.findOne({ userId, articleId });
        await checkExistingFavoriteArticle(existingFavoriteArticle, userId, articleId, res)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};

async function checkExistingFavoriteArticle(existingFavoriteArticle, userId, articleId, res) {
    if (existingFavoriteArticle) {
        await Favorite.deleteOne({ _id: existingFavoriteArticle._id });
        handleExistingFavoriteArticle(existingFavoriteArticle, userId, articleId, res);
    } else {
        const favorite = new Favorite({ userId, articleId});
        await favorite.save();
        return res.status(201).json({ message: 'Article ajouté dans la liste des favoris', favorite });
    }
}

async function handleExistingFavoriteArticle(existingFavoriteArticle, userId, articleId, res) {
    if (existingFavoriteArticle.articleId.toString() === articleId && existingFavoriteArticle.userId.toString() === userId.toString()) {
        return res.status(200).json({ message: "Votre article n'est plus dans la liste des favoris" });
    } else {
        const favorite = new Favorite({ userId, articleId });
        await favorite.save();
        return res.status(200).json({ message: 'Votre article est dans la liste des favoris', favorite });
    }
}