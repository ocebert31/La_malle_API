const Article = require('../models/articles')
const fs = require('fs');
const mongoose = require('mongoose');
const Favorite = require('../models/favorites'); 

exports.createArticle = async (req, res) => {
    if(!req.auth || req.auth.role === 'reader') {
        return res.status(403).json({ message: 'Requête non autorisée' });
    }

    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
    const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
        tags: tags,
        imageUrl,
        userId: req.auth.userId,
        categoryId: req.body.categoryId,
        price: req.body.price,
    });
    if (tags && tags.length > 5) {
        return res.status(404).json({ message: 'Seulement 5 tags sont autorisés' });
    }
    article.save()
    .then(article => { res.status(200).json({ article })})
    .catch(error => { res.status(400).json( { error })})
};

exports.getAllArticles = async (req, res) => {
    const { searchQuery = '', page = 1, limit = 20, type = 'all', categoryId = null } = req.query;
    try {
        const currentPage = parseInt(page, 10);
        const articlesLimit = parseInt(limit, 10);
        let matchStage = {};

        if (type === 'favorites' && req.auth) {
            const favoriteArticles = await Favorite.find({ userId: req.auth.userId }).populate('articleId');
            const favoriteArticleIds = favoriteArticles
                .filter(favorite => favorite.articleId)
                .map(favorite => favorite.articleId._id);

                matchStage = searchQuery ? { 
                        _id: { $in: favoriteArticleIds },
                        $or: [
                            { title: { $regex: searchQuery, $options: 'i' } },
                            { categoryId: { $regex: searchQuery, $options: 'i' } },
                            { tags: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }
                        ]
                    } : { 
                        _id: { $in: favoriteArticleIds } 
                    };
                } else {
                    matchStage = searchQuery ? { 
                        $or: [
                            { title: { $regex: searchQuery, $options: 'i' } },
                            { categoryId: { $regex: searchQuery, $options: 'i' } },
                            { tags: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }
                        ]
                    } : {};
                }

        if (categoryId) {
            matchStage.categoryId = new mongoose.Types.ObjectId(categoryId);
        }
        const articles = await Article.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    title: 1,
                    imageUrl: 1,
                    content: 1,
                    tags: 1,
                    price: 1,
                    createdAt: 1,
                    pseudo: '$user.pseudo',
                    categoryName: '$category.name',
                    categoryId: 1,
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: (currentPage - 1) * articlesLimit },
            { $limit: articlesLimit },
        ]);
        res.status(200).json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getOneArticle =  async (req, res) => {
    let favorite = null;
    const userId = req.auth && req.auth.userId ? new mongoose.Types.ObjectId(req.auth.userId): null;
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
        {
            $lookup: {
                from: 'votes',
                localField: '_id',
                foreignField: 'articleId',
                as: 'votes'
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId', 
                foreignField: '_id',
                as: 'category'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                upvotes: {
                    $size: {
                        $filter: {
                            input: '$votes',
                            as: 'vote',
                            cond: { $eq: ['$$vote.voteType', 'upvote'] }
                        }
                    }
                },
                downvotes: {
                    $size: {
                        $filter: {
                            input: '$votes',
                            as: 'vote',
                            cond: { $eq: ['$$vote.voteType', 'downvote'] }
                        }
                    }
                },
                userVotes: userId ? {
                    $let: {
                        vars: {
                            filteredVotes: {
                                $filter: {
                                    input: '$votes',
                                    as: 'vote',
                                    cond: { $eq: ['$$vote.userId', userId] }
                                }
                            }
                        },
                        in: {
                            $arrayElemAt: ['$$filteredVotes', 0]
                        }
                    }
                } : null
            }
        },
        {
            $project: {
                title: 1,
                imageUrl: 1,
                content: 1,
                tags: 1, 
                price: 1,
                createdAt: 1,
                userId: 1,
                pseudo: '$user.pseudo',
                upvotes: 1,
                downvotes: 1,
                userVote: userId ? { voteType: '$userVotes.voteType' } : null,
                categoryId: 1,
                categoryName: '$category.name',
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
            const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];
            const update = {
                title: req.body.title,
                content: req.body.content,
                tags: tags,
                categoryId: req.body.categoryId,
                price: req.body.price,
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
            .then(async (updatedArticle) => {
                const articleWithDetails = await Article.aggregate([
                    { $match: { _id: updatedArticle._id } },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'categoryId',
                            foreignField: '_id',
                            as: 'category'
                        }
                    },
                    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                    { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            title: 1,
                            content: 1,
                            tags: 1,
                            price: 1,
                            imageUrl: 1,
                            createdAt: 1,
                            pseudo: '$user.pseudo',
                            categoryName: '$category.name'
                        }
                    }
                ]);

                if (!articleWithDetails.length) {
                    return res.status(404).json({ message: 'Article mis à jour non trouvé' });
                }

                res.status(200).json({ article: articleWithDetails[0] });
            })
            .catch((error) => res.status(400).json({ error: error.message }));
        })
        .catch((error) => res.status(500).json({ error: error.message }));
};

function hasAccessToArticle(article, auth) {
    return article.userId.toString() === auth.userId.toString() || auth.role === 'admin';
}