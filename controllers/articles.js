const Article = require('../models/articles')
const fs = require('fs');
const mongoose = require('mongoose');
const Favorite = require('../models/favorites'); 

exports.createArticle = (req, res) => {
    if(!req.auth) {
        return res.status(403).json({ message: 'Requête non autorisée' });
    }
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
        imageUrl,
        userId: req.auth.userId 
    });
    article.save()
    .then(article => { res.status(200).json({ article })})
    .catch(error => { res.status(400).json( { error })})
};

exports.getAllArticles = (req, res) => {
    const { searchQuery = '', page = 1, limit = 20 } = req.query;
    const filter = searchQuery ? { title: { $regex: searchQuery, $options: 'i' } } : {};
    Article.aggregate([
        { $match: filter },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                title: 1,
                imageUrl: 1,
                content: 1,
                createdAt: 1,
                pseudo: '$user.pseudo',
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) }
    ])
        .then(articles => res.status(200).json(articles))
        .catch(error => { console.error(error); return res.status(400).json({ error }) });
};
 
exports.getOneArticle =  async (req, res) => {
    let favorite = null;
    console.log(req.auth)
    if(req.auth) {
        favorite = await Favorite.findOne({ userId: req.auth.userId, articleId: req.params.id });
    }
    Article.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                title: 1,
                imageUrl: 1,
                content: 1,
                createdAt: 1,
                userId: 1,
                pseudo: '$user.pseudo',
            }
        }
    ]).then(articles => {
        if (!articles.length) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        res.status(200).json({...articles[0], favorite});
    })
}

exports.deleteArticle = (req, res) => {
    const articleId = req.params.id;

    Article.findOne({ _id: articleId })
        .then(article => {
            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }
            if (!hasAccessToArticle(article, req.auth)) {
                return res.status(403).json({ message: 'Requête non autorisée' });
            }
            const filename = article.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Article.deleteOne({ _id: articleId })
                    .then(() => res.status(200).json({ message: 'Article supprimé !' }))
            });
        })
};

exports.updateArticle = (req, res) => {
    Article.findOne({ _id: req.params.id })
        .then(article => {
            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }
            if (!hasAccessToArticle(article, req.auth)) {
                return res.status(403).json({ message: 'Requête non autorisée' });
            }

            const update = {
                title: req.body.title,
                content: req.body.content
            };
            if (req.file) {
                const oldFilename = article.imageUrl.split('/images/')[1];
                fs.unlink(`images/${oldFilename}`, (err) => {
                    if (err) console.error(err);
                });
                update.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            }

            Article.findOneAndUpdate(
                { _id: req.params.id },
                { ...update, _id: req.params.id },
                { new: true }
            )
            .then((updatedArticle) => {
                res.status(200).json({ article: updatedArticle });
            })
            .catch((error) => res.status(400).json({ error: error.message }));
        })
        .catch((error) => res.status(500).json({ error: error.message }));
};

function hasAccessToArticle(article, auth) {
    return article.userId.toString() === auth.userId || auth.role === 'admin';
}